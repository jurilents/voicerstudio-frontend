import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSub, patchMarker, patchSub, selectSpeaker, selectSub } from '../../../store/sessionReducer';
import { Sub } from '../../../models';
import { setPlaying, setTime } from '../../../store/timelineReducer';
import TimelineWrap from './TimelineWrap';
import AudioActionRenderer from './action-renderers/AudioActionRenderer';
import SubtitleActionRenderer from './action-renderers/SubtitleActionRenderer';
import { calculateScaleAndWidth } from '../../../utils/timelineScale';
import MarkerActionRenderer from './action-renderers/MarkerActionRenderer';
import { Style } from './TimelineEditor.styles';
import debounce from 'lodash/debounce';

const origAudioRowName = 'original-audio-row';
const markersRowName = 'markers-row';

let prevData = null;
let cursorElm = null;

function getCursorElement() {
    if (!cursorElm) cursorElm = document.querySelector('.timeline-editor-cursor');
    return cursorElm;
}

function isSpeakerRow(row) {
    return row?.id && row.id !== origAudioRowName && row.id !== markersRowName;
}

function getTimelineData({ speakers, selectedSpeaker, markers, player }) {
    const data = speakers.map((speaker) => ({
        id: speaker.id,
        selected: speaker.id === selectedSpeaker?.id,
        actions: speaker.subs,
        color: speaker.color,
    }));

    if (!player || isNaN(+player.duration)) return data;

    // Add markers
    data.unshift({
        id: markersRowName,
        rowHeight: 1,
        classNames: ['markers-row'],
        actions: markers.map((marker) => ({
            id: marker.id,
            start: marker.time,
            end: marker.time,
            flexible: false,
            data: { color: marker.color, text: marker.text },
        })),
    });
    // Add original audio
    data.unshift({
        id: origAudioRowName,
        rowHeight: 100,
        classNames: ['waveform-row'],
        actions: [
            {
                id: 'original-audio',
                // effectId: effectKeys.audioTrack,
                start: 0,
                end: player.duration,
                disableDrag: true,
                movable: false,
                flexible: false,
                data: { player },
            },
        ],
    });

    prevData = data;
    return data;
}

const TimelineEditor = ({ headingRef }) => {
    const dispatch = useDispatch();
    const player = useSelector((store) => store.player.videoPlayer);
    const { speakers, selectedSpeaker, selectedSub, markers, videoUrl } = useSelector((store) => store.session);
    const timelineZoom = useSelector((store) => store.timelineSettings.timelineZoom);
    const [zoom, setZoom] = useState({ scale: 1, scaleWidth: 100, scaleCount: 60 });
    const data = useMemo(
        () => getTimelineData({ speakers, selectedSpeaker, markers, player }),
        [speakers, selectedSpeaker, markers, selectedSub, player, isNaN(+player?.duration)],
    );

    function calcLeftOffset(time, zoom) {
        const pixelPerSecond = zoom.scaleWidth / zoom.scale;
        return time * pixelPerSecond + 20; // TimelineWrap.startLeft = 20
    }

    // ------- Zoom -------
    useEffect(() => {
        if (!window.timelineEngine) return;
        const engine = window.timelineEngine;

        if (engine?.target && !isNaN(player.duration)) {
            const zoom = calculateScaleAndWidth(timelineZoom, player.duration, engine.target.clientWidth);
            // const zoom = {scale: 1, scaleWidth: 150, scaleCount: };
            setZoom(zoom);
            // console.log('zoom:', zoom);
        }
    }, [player?.currentSrc, player?.duration, setZoom, timelineZoom]);

    const scrollToCursor = useCallback(
        (time) => {
            if (!window.timelineEngine) return;
            const engine = window.timelineEngine;
            const $cursorElm = getCursorElement();

            const totalWidth = engine.target.clientWidth;
            const cursorPosition = +$cursorElm.style.left.substring(0, $cursorElm.style.left.length - 2);
            const cursorDelta = totalWidth - cursorPosition;

            if (cursorDelta < 10 && cursorDelta > 0) {
                const a = calcLeftOffset(time, zoom) - 5;
                engine.setScrollLeft(a);
            } else if (cursorDelta <= 0 || cursorDelta > totalWidth) {
                const b = calcLeftOffset(time, zoom) - 150;
                engine.setScrollLeft(b);
            }
        },
        [window.timelineEngine, zoom],
    );

    useEffect(() => {
        if (!window.timelineEngine) return;
        const engine = window.timelineEngine;

        engine.listener.on('play', function handler_() {
            dispatch(setPlaying(true));
            if (player) player.currentTime = engine.getTime();
        });
        engine.listener.on('paused', function handler_() {
            dispatch(setPlaying(false));
            if (player) player.currentTime = engine.getTime();
        });
        engine.listener.on('afterSetTime', function handler_({ time }) {
            dispatch(setTime(time));
            setTimeout(() => {
                scrollToCursor(time);
            }, 10);
        });
        engine.listener.on('setTimeByTick', function handler_({ time }) {
            if (window.recordingSub) window.recordingSub.end = time;
            dispatch(setTime(time));
            scrollToCursor(time);
        });

        return () => {
            if (!engine) return;
            // engine.pause();
            const handlersName = 'handler_';
            const listeners = engine.listener.events;
            listeners.play = listeners.play.filter((x) => x.name !== handlersName);
            listeners.paused = listeners.paused.filter((x) => x.name !== handlersName);
            listeners.afterSetTime = listeners.afterSetTime.filter((x) => x.name !== handlersName);
            listeners.setTimeByTick = listeners.setTimeByTick.filter((x) => x.name !== handlersName);
        };
    }, [window.timelineEngine, scrollToCursor]);

    const handleScroll = useCallback(
        ({ scrollTop }) => {
            if (headingRef.current) {
                headingRef.current.scrollTop = scrollTop;
            }
        },
        [headingRef],
    );

    const addSubtitle = useCallback(
        (param) => {
            const selectedAction = param.row.actions.find((x) => x.selected);
            if (!selectedAction) {
                const startTime = +(Math.round(param.time * 10) / 10).toFixed(2);
                console.log('startTime', startTime);
                if (selectedSpeaker.subs.find((x) => x.start < startTime && x.end > startTime)) {
                    return;
                }
                const newSub = new Sub({
                    speakerId: selectedSpeaker.id,
                    start: startTime,
                    end: startTime + 2,
                    text: '',
                });
                dispatch(addSub(newSub));
            }
        },
        [dispatch, selectedSpeaker],
    );

    const setSubtitle = useCallback(
        (param, lockCursor = false) => {
            if (param.row.id !== origAudioRowName) {
                if (window.timelineEngine) {
                    const cursorTime = window.timelineEngine.getTime();
                    if (!lockCursor && (param.action.start > cursorTime || param.action.end <= cursorTime)) {
                        window.timelineEngine.setTime(param.action.start);
                    }
                }

                if (param.row.id !== markersRowName) {
                    dispatch(selectSub(param.action));
                }
            }
        },
        [dispatch],
    );

    const setTimeToSubEnd = useCallback(
        (param) => {
            if (isSpeakerRow(param.row)) {
                dispatch(setTime(param.action.end));
                if (window.timelineEngine) {
                    window.timelineEngine.setTime(param.action.end);
                }
            }
        },
        [dispatch],
    );

    const setSpeaker = useCallback(
        (param) => {
            if (isSpeakerRow(param.row)) {
                dispatch(selectSpeaker(param.row.id));
            }
        },
        [dispatch],
    );

    function setSubStartEndTime({ action, dir, start, end }) {
        if (dir === 'left') {
            dispatch(patchSub(action, { start }));
        } else if (dir === 'right') {
            dispatch(patchSub(action, { end }));
        } else {
            dispatch(patchSub(action, { start, end }));
        }
    }

    function setMarkerTime({ action, start }) {
        dispatch(
            patchMarker(action, {
                time: start,
            }),
        );
    }

    const handleActionMoveOrResize = debounce((param) => {
        if (isSpeakerRow(param.row)) {
            setSubStartEndTime(param);
        } else if (param.row.id === markersRowName) {
            setMarkerTime(param);
        }
    }, 12);

    const onTimeChange = useCallback(
        (time) => {
            if (!window.timelineEngine) return;
            const engine = window.timelineEngine;
            engine.pause();

            if (player) {
                if (!player.paused) player.pause();

                if (!isNaN(+time)) {
                    if (!isNaN(+player.duration)) {
                        if (time < 0) time = 0;
                        if (time > player.duration) {
                            time = player.duration;
                            // setTimeout(() => engine.setTime(time), 100);
                        }
                    }

                    dispatch(setTime(time));
                    player.currentTime = time;
                }
            }
        },
        [window.recordingSub, dispatch, player],
    );

    const getActionRender = useCallback(
        (action, row) => {
            if (row.id === origAudioRowName) {
                return <AudioActionRenderer action={action} row={row} />;
            } else if (row.id === markersRowName) {
                return <MarkerActionRenderer action={action} row={row} />;
            }
            return <SubtitleActionRenderer action={action} row={row} />;
        },
        [selectedSpeaker, selectedSub],
    );

    return (
        <Style className="noselect">
            <TimelineWrap
                player={player}
                data={data}
                onTimeChange={onTimeChange}
                onScroll={handleScroll}
                onClickAction={setSubtitle}
                onDoubleClickAction={setTimeToSubEnd}
                onActionResizeStart={(param) => setSubtitle(param, true)}
                onActionResizing={handleActionMoveOrResize}
                onActionMoveStart={(param) => setSubtitle(param, true)}
                onActionMoving={handleActionMoveOrResize}
                onClickRow={setSpeaker}
                getActionRender={getActionRender}
                onDoubleClickRow={addSubtitle}
                zoom={zoom}
                setZoom={setZoom}
            />
        </Style>
    );
};

export default memo(TimelineEditor, (prevProps, nextProps) => {
    return nextProps.player && prevProps.player?.src === nextProps.player.src;
});
