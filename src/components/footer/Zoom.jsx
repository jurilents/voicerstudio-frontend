import React from 'react';
import styled from 'styled-components';
import { clamp } from 'lodash';

const Style = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: -8px;
    z-index: 1100;
    width: 100%;
    height: 8px;
    user-select: none;
    border-top: 1px solid rgb(255 255 255 / 20%);
    background-color: rgb(0 0 0 / 50%);
    border-radius: 0;

    .bar {
        position: absolute;
        left: 5px;
        top: 0;
        bottom: 0;
        width: 0;
        height: 100%;
        display: inline-block;
        background-color: rgb(255 255 255 / 30%);
        overflow: visible;

        .handle {
            position: absolute;
            right: -5px;
            top: 0;
            bottom: 0;
            width: 10px;
            cursor: ew-resize;
            background-color: #c9c9c9;
            color: black;
            display: flex;
            padding: 1px;
        }
    }
`;

const offset = 10;

function calcZoom(eventX) {
    // TODO: Zoom handle not always is under the cursor
    const screenDelta = (eventX - offset) / (document.body.clientWidth - offset * 2);
    return +clamp(screenDelta, 0.0001, 1).toFixed(5);
}

export default function Zoom({ waveform, player, headingWidth }) {
    // const [grabbing, setGrabbing] = useState(false);
    // const dispatch = useDispatch();
    // const { timelineZoom, waveZoom } = useSelector(store => store.timelineSettings);
    // const [zoom, setZoom] = useState(timelineZoom);

    // function applyZoom(zoom) {
    //   // if (!window.timelineEngine) return;
    //   // const engine = window.timelineEngine;
    //   if (!player.paused) player.pause();
    //   dispatch(setTimelineSettings({ timelineZoom: zoom }));
    //   console.log('final zoom: ', zoom);
    //   // engine.set();
    // }
    //
    // const onProgressClick = useCallback(
    //   (event) => {
    //     if (event.button !== 0) return;
    //     const zoomValue = calcZoom(event.pageX);
    //     setZoom(zoomValue);
    //     applyZoom(zoomValue);
    //   },
    //   [dispatch, headingWidth],
    // );
    //
    // const onGrabDown = useCallback(
    //   (event) => {
    //     if (event.button !== 0) return;
    //     setGrabbing(true);
    //   },
    //   [setGrabbing],
    // );
    //
    // const onGrabMove = useCallback(
    //   (event) => {
    //     if (grabbing) {
    //       const zoomValue = calcZoom(event.pageX);
    //       setZoom(zoomValue);
    //     }
    //   },
    //   [grabbing, dispatch, player, headingWidth],
    // );
    //
    // const onDocumentMouseUp = useCallback(() => {
    //   if (grabbing) {
    //     setGrabbing(false);
    //     if (zoom > 0 && zoom <= 1) {
    //       applyZoom(zoom);
    //     }
    //   }
    // }, [grabbing, dispatch, player.currentTime]);
    //
    // useEffect(() => {
    //   document.addEventListener('mouseup', onDocumentMouseUp);
    //   document.addEventListener('mousemove', onGrabMove);
    //   return () => {
    //     document.removeEventListener('mouseup', onDocumentMouseUp);
    //     document.removeEventListener('mousemove', onGrabMove);
    //   };
    // }, [onDocumentMouseUp, onGrabMove]);

    // useEffect(() => {
    //   if (waveform) {
    //     waveform.setOptions({
    //       duration: timelineZoom * 500,
    //     });
    //   }
    // }, [timelineZoom]);

    // useEffect(() => {
    //   if (waveform) {
    //     waveform.setOptions({
    //       waveScale: waveZoom,
    //     });
    //   }
    // }, [waveZoom]);

    return (
        <Style className="zoom">
            {/*onClick={onProgressClick}>*/}
            {/*<div className='bar' style={{ width: `calc(${zoom * 100}% - 10px)` }}>*/}
            {/*  <div className='handle' onMouseDown={onGrabDown}></div>*/}
            {/*</div>*/}
        </Style>
    );
}
