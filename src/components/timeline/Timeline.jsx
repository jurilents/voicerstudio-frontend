import { ContextMenuTrigger } from 'react-contextmenu';
import React, { createRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import DT from 'duration-time-conversion';
import { getKeyCode } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { patchSub, removeSub, selectSpeaker, setAllSubs } from '../../store/sessionReducer';

const Style = styled.div`
  position: absolute;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  .react-contextmenu-wrapper {
    position: absolute;
    z-index: 9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: all;
  }

  .sub-item {
    opacity: 60%;
    position: absolute;
    //top: 30%;
    left: 0;
    height: 50px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
    font-size: 14px;
    cursor: move;
    user-select: none;
    pointer-events: all;
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .sub-handle {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 1;
      height: 100%;
      cursor: col-resize;
      user-select: none;
    }

    .sub-text {
      position: relative;
      z-index: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      word-break: break-all;
      white-space: nowrap;
      text-shadow: rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px,
      rgb(0 0 0) 0px -1px 1px;
      width: 100%;
      height: 100%;

      p {
        width: calc(100% - 8px);
        line-height: 1;
        margin: 2px 4px;
        overflow: hidden;
        text-overflow: ellipsis;

        &.bilingual {
          transform: scale(0.8);
        }
      }
    }

    .sub-duration {
      opacity: 0.5;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      font-size: 12px;
    }
  }

  .active-speaker {
    .sub-item {
      opacity: 100%;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      &.sub-highlight {
        background-color: rgba(33, 150, 243, 0.5);
        border: 1px solid rgba(33, 150, 243, 0.5);
      }

      &.sub-illegal {
        background-color: rgba(199, 81, 35, 0.5);
      }

      .sub-handle {
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
`;

function getVisibleSubs(subs, beginTime, duration) {
  return subs.filter((item) => {
    return (
      (item.startTime >= beginTime && item.startTime <= beginTime + duration) ||
      (item.endTime >= beginTime && item.endTime <= beginTime + duration) ||
      (item.startTime < beginTime && item.endTime > beginTime + duration)
    );
  });
}

function magnetically(time, closeTime) {
  if (!closeTime) return time;
  if (time > closeTime - 0.1 && closeTime + 0.1 > time) {
    return closeTime;
  }
  return time;
}

let lastTarget = null;
let lastSub = null;
let lastType = '';
let lastX = 0;
let lastIndex = -1;
let lastWidth = 0;
let lastDiffX = 0;
let isDragging = false;

export default React.memo(function Timeline({ player, render, currentTime, headingWidth }) {
    const $blockRef = createRef();
    const $subsRefs = createRef();
    $subsRefs.current = [];

    const dispatch = useDispatch();
    const { selectedSub, speakers, selectedSpeaker } = useSelector(store => store.session);
    const { timelineRowHeight, magnetMode } = useSelector(store => store.settings);

    const cursorSubs = [];
    for (const speaker of speakers) {
      speaker.visibleSubs = getVisibleSubs(speaker.subs, render.beginTime, render.duration);
      cursorSubs.push(...speaker.subs.filter(x => x.startTime <= currentTime && x.endTime > currentTime));
    }
    const gridGap = (document.body.clientWidth - headingWidth) / render.gridNum;
    console.log('cursorSubs', cursorSubs);

    const onMouseDown = (sub, event, type) => {
      if (sub.speakerId !== selectedSpeaker.id) {
        dispatch(selectSpeaker(sub.speakerId));
      }
      lastSub = sub;
      if (event.button !== 0) return;
      isDragging = true;
      lastType = type;
      lastX = event.pageX - headingWidth;
      lastIndex = selectedSpeaker.subs.indexOf(sub);
      const speakerId = `speaker-${lastSub.speakerId}`;
      const $subsRef = $subsRefs.current.find(x => x.id === speakerId);
      console.log('$subsRef', $subsRef.children);
      lastTarget = Array.from($subsRef.children).find(x => x.id === lastSub.id);
      lastWidth = parseFloat(lastTarget.style.width);
    };

    const onDoubleClick = (sub, event) => {
      const $subs = event.currentTarget;
      const index = selectedSpeaker.subs.findIndex(x => x.id === sub.id);
      const prev = selectedSpeaker.subs[index - 1];
      const next = selectedSpeaker.subs[index + 1];
      if (prev && next) {
        const width = (next.startTime - prev.endTime) * 10 * gridGap;
        $subs.style.width = `${width}px`;
        const start = DT.d2t(prev.endTime);
        const end = DT.d2t(next.startTime);
        dispatch(patchSub(sub, { start, end }));
      }
    };

    const onDocumentMouseMove = useCallback((event) => {
      if (isDragging && lastTarget) {
        lastDiffX = event.pageX - headingWidth - lastX;
        if (lastType === 'left') {
          lastTarget.style.width = `${lastWidth - lastDiffX}px`;
          lastTarget.style.transform = `translate(${lastDiffX}px)`;
        } else if (lastType === 'right') {
          lastTarget.style.width = `${lastWidth + lastDiffX}px`;
        } else {
          lastTarget.style.transform = `translate(${lastDiffX}px)`;
        }
      }
    }, []);

    const onDocumentMouseUp = useCallback(() => {
      if (isDragging && lastTarget && lastDiffX) {
        const timeDiff = lastDiffX / gridGap / 10;
        const index = selectedSpeaker.subs.findIndex(x => x.id === lastSub.id);
        const previous = selectedSpeaker.subs[index - 1];
        const next = selectedSpeaker.subs[index + 1];

        let startTime = lastSub.startTime + timeDiff;
        let endTime = lastSub.endTime + timeDiff;
        if (magnetMode) {
          startTime = magnetically(startTime, previous ? previous.endTime : null);
          endTime = magnetically(endTime, next ? next.startTime : null);
        }

        const width = (endTime - startTime) * 10 * gridGap;

        if ((previous && endTime < previous.startTime) || (next && startTime > next.endTime)) {
          dispatch(setAllSubs(selectedSpeaker.subs.sort((a, b) => parseFloat(a.startTime) - parseFloat(b.startTime))));
        }

        if (lastType === 'left') {
          if (startTime >= 0 && lastSub.endTime - startTime >= 0.2) {
            const start = DT.d2t(startTime);
            dispatch(patchSub(lastSub, { start }));
          } else {
            lastTarget.style.width = `${width}px`;
          }
        } else if (lastType === 'right') {
          if (endTime >= 0 && endTime - lastSub.startTime >= 0.2) {
            const end = DT.d2t(endTime);
            dispatch(patchSub(lastSub, { end }));
          } else {
            lastTarget.style.width = `${width}px`;
          }
        } else {
          if (startTime > 0 && endTime > 0 && endTime - startTime >= 0.2) {
            const start = DT.d2t(startTime);
            const end = DT.d2t(endTime);
            dispatch(patchSub(lastSub, { start, end }));
          } else {
            lastTarget.style.width = `${width}px`;
          }
        }

        lastTarget.style.transform = `translate(0)`;
      }

      lastType = '';
      lastX = 0;
      lastWidth = 0;
      lastDiffX = 0;
      isDragging = false;
    }, [gridGap, dispatch]);

    const addSubsRef = (subsElm) => {
      if (subsElm && !$subsRefs.current.includes(subsElm)) {
        $subsRefs.current.push(subsElm);
      }
    };

    const onKeyDown = useCallback(
      (event) => {
        const sub = selectedSpeaker.visibleSubs[lastIndex];
        if (sub && lastTarget) {
          const keyCode = getKeyCode(event);
          switch (keyCode) {
            case 37:
              const overflow = sub.startTime - 0.1 <= 0;
              dispatch(patchSub(sub, {
                start: DT.d2t(overflow ? 0 : sub.startTime - 0.1),
                end: DT.d2t(overflow ? sub.endTime - sub.startTime : sub.endTime - 0.1),
              }));
              player.currentTime = sub.startTime - 0.1;
              break;
            case 39:
              dispatch(patchSub(sub, {
                start: DT.d2t(sub.startTime + 0.1),
                end: DT.d2t(sub.endTime + 0.1),
              }));
              player.currentTime = sub.startTime + 0.1;
              break;
            case 8:
            case 46:
              dispatch(removeSub(sub));
              break;
            default:
              break;
          }
        }
      },
      [selectedSpeaker, player, dispatch],
    );

    const onSubClick = (sub) => {
      if (player.duration >= sub.startTime) {
        player.currentTime = sub.startTime + 0.001;
      }
    };

    const checkSub = useCallback(
      (sub) => {
        const index = selectedSpeaker.subs.findIndex(x => x.id === sub.id);
        if (index < 0) return;
        const previous = selectedSpeaker.subs[index - 1];
        return (previous && sub.startTime < previous.endTime) || !sub.isValid || sub.duration < 0.2;
      },
      [selectedSpeaker],
    );

    useEffect(() => {
      document.addEventListener('mousemove', onDocumentMouseMove);
      document.addEventListener('mouseup', onDocumentMouseUp);
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
        window.removeEventListener('keydown', onKeyDown);
      };
    }, [onDocumentMouseMove, onDocumentMouseUp, onKeyDown]);

    return (
      <Style ref={$blockRef} className='timeline'>
        {speakers && speakers.map((speaker, index) => (
          <div key={index} ref={addSubsRef} id={`speaker-${speaker.id}`}
               className={selectedSpeaker.id === speaker.id ? 'active-speakerId' : ''}>
            {speaker.subs && speaker.subs.map((sub, index) => {
              console.log('sub.startTime', sub.startTime);
              return (
                <div
                  key={index}
                  id={sub.id}
                  className={[
                    'sub-item',
                    sub.id === cursorSubs.id ? 'sub-highlight' : '',
                    checkSub(sub) ? 'sub-illegal' : '',
                  ].join(' ').trim()}
                  style={{
                    bottom: timelineRowHeight * index + 12,
                    left: render.padding * gridGap + (sub.startTime - render.beginTime) * gridGap * 10,
                    width: (sub.endTime - sub.startTime) * gridGap * 10,
                    height: timelineRowHeight - 4,
                  }}
                  onClick={() => onSubClick(sub)}
                  onDoubleClick={(event) => onDoubleClick(sub, event)}>
                  <ContextMenuTrigger id='contextmenu' holdToDisplay={-1}>
                    <div
                      className='sub-handle'
                      style={{ left: 0, width: 10 }}
                      onMouseDown={(event) => onMouseDown(sub, event, 'left')}>
                    </div>
                    <div
                      className='sub-text'
                      title={sub.text}
                      onMouseDown={(event) => onMouseDown(sub, event)}>
                      {`${sub.text}`.split(/\r?\n/).map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                    <div
                      className='sub-handle'
                      style={{ right: 0, width: 10 }}
                      onMouseDown={(event) => onMouseDown(sub, event, 'right')}>
                    </div>
                    <div className='sub-duration'>{sub.duration}</div>
                  </ContextMenuTrigger>
                </div>
              );
            })}
          </div>
        ))}
        {/*<ContextMenu id='contextmenu'>*/}
        {/*  <MenuItem onClick={() => removeSub(lastSub)}>*/}
        {/*    <Translate value='DELETE' />*/}
        {/*  </MenuItem>*/}
        {/*  <MenuItem onClick={() => mergeSub(lastSub)}>*/}
        {/*    <Translate value='MERGE' />*/}
        {/*  </MenuItem>*/}
        {/*</ContextMenu>*/}
      </Style>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.render, nextProps.render) &&
      prevProps.currentTime === nextProps.currentTime
    );
  },
);
