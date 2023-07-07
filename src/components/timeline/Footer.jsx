import styled from 'styled-components';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';
import TimelineEditor from './new/TimelineEditor';
import { TimelineHeading } from './new/TimelineHeading';
import Progress from './Progress';
import Zoom from './Zoom';

const Style = styled.div`
  height: 400px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  padding-bottom: 35px;
  margin-top: 10px;
  position: relative;
`;

export default function Footer(props) {
  const $footer = createRef();
  const [headingWidth, setHeadingWidth] = useState(200);
  const [render, setRender] = useState({
    padding: 2,
    duration: 10,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });

  const onWheel = useCallback(
    (event) => {
      if (
        !props.player ||
        !props.waveform ||
        props.player.playing ||
        !$footer.current ||
        !$footer.current.contains(event.target)
      ) {
        return;
      }

      const direction = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const scrollDelta = Math.sign(direction) / 5;
      const currentTime = clamp(props.player.currentTime + scrollDelta, 0, props.player.duration);
      props.player.currentTime = currentTime;
      props.waveform.seek(currentTime);
    },
    [props.waveform, props.player, $footer],
  );

  useEffect(() => {
    const onWheelThrottle = throttle(onWheel, 100);
    window.addEventListener('wheel', onWheelThrottle, { passive: true });
    return () => window.removeEventListener('wheel', onWheelThrottle);
  }, [onWheel]);
  //
  // useEffect(() => {
  //   if (props.waveform && !isEmpty(settings)) {
  //     console.log('settings.waveZoom', settings.waveZoom);
  //     props.waveform.setOptions({
  //       scrollable: settings.scrollableMode || false,
  //       // duration: +(settings.zoom || 1) * 5,
  //       // waveSize: +settings.waveZoom,
  //     });
  //   }
  // }, [props.waveform, settings]);

  return (
    <Style className='footer' ref={$footer}>
      <TimelineHeading />
      {/*<div className='timeline-outlet'>*/}
      <TimelineEditor {...props} headingWidth={headingWidth} />
      {/*  {props.player ? (*/}
      {/*    <>*/}
      {/*      <Waveform {...props} setRender={setRender} />*/}
      {/*      <Grab {...props} render={render} headingWidth={headingWidth} />*/}
      {/*      <Metronome {...props} render={render} headingWidth={headingWidth} />*/}
      {/*      <Timeline {...props} render={render} headingWidth={headingWidth} />*/}

      {props.player && (
        <>
          <Zoom {...props} headingWidth={headingWidth} />
          <Progress {...props} headingWidth={headingWidth} />
        </>
      )}

      {/*    </>*/}
      {/*  ) : null}*/}
      {/*</div>*/}
    </Style>
  );
}
