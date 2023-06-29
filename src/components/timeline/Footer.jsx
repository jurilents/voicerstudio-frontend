import styled from 'styled-components';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';
import Timeline from './Timeline';
import Metronome from '../Metronome';
import Waveform from './Waveform';
import Grab from './Grab';
import Progress from './Progress';
import Duration from './Duration';
import TimelineHeading from './TimelineHeading';
import { isEmpty } from 'lodash';
import { useSettings } from '../../hooks';

const Style = styled.div`
  height: 400px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;

  .timeline-outlet {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(100% - 200px);
  }
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
  const { settings } = useSettings();

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

  useEffect(() => {
    if (props.waveform && !isEmpty(settings)) {
      console.log('set options 3:');
      props.waveform.setOptions({
        scrollable: settings.scrollableMode || false,
        duration: +(settings.zoom || 1) * 5,
      });
    }
  }, [props.waveform, settings]);

  return (
    <Style className='footer' ref={$footer}>
      <TimelineHeading />
      <div className='timeline-outlet'>
        {props.player ? (
          <>
            <Progress {...props} headingWidth={headingWidth} />
            <Duration {...props} />
            <Waveform {...props} setRender={setRender} />
            <Grab {...props} render={render} headingWidth={headingWidth} />
            <Metronome {...props} render={render} />
            <Timeline {...props} render={render} />
          </>
        ) : null}
      </div>
    </Style>
  );
}
