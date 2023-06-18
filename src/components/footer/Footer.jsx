import styled from 'styled-components';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';
import Timeline from '../Timeline';
import Metronome from '../Metronome';
import { Waveform } from './Waveform';
import { Grab } from './Grab';
import { Progress } from './Progress';
import { Duration } from './Duration';

const Style = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  .progress {
    position: absolute;
    left: 0;
    right: 0;
    top: -35px;
    z-index: 11;
    width: 100%;
    height: 35px;
    user-select: none;
    border-top: 1px solid rgb(255 255 255 / 20%);
    background-color: rgb(0 0 0 / 50%);

    .bar {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0%;
      height: 100%;
      display: inline-block;
      background-color: #730000;
      overflow: hidden;

      .handle {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 10px;
        cursor: ew-resize;
        background-color: #ff9800;
      }
    }

    .subtitle {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;

      span {
        position: absolute;
        top: 0;
        bottom: 0;
        height: 100%;
        background-color: rgb(255 255 255 / 20%);
      }
    }
  }

  .duration {
    position: absolute;
    left: 0;
    right: 0;
    top: -31px;
    z-index: 12;
    width: 100%;
    font-size: 18px;
    color: rgb(255 255 255 / 75%);
    text-shadow: 0 1px 2px rgb(0 0 0 / 75%);
    text-align: center;
    user-select: none;
    pointer-events: none;
  }

  .waveform {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    z-index: 1;
    user-select: none;
    pointer-events: none;
  }

  .grab {
    position: relative;
    z-index: 11;
    cursor: grab;
    height: 20%;
    user-select: none;
    background-color: rgb(33 150 243 / 20%);
    border-top: 1px solid rgb(33 150 243 / 30%);
    border-bottom: 1px solid rgb(33 150 243 / 30%);

    &.grabbing {
      cursor: grabbing;
    }
  }
`;

export default function Footer(props) {
    const $footer = createRef();
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

            const deltaY = Math.sign(event.deltaY) / 5;
            const currentTime = clamp(props.player.currentTime + deltaY, 0, props.player.duration);
            props.player.currentTime = currentTime;
            props.waveform.seek(currentTime);
        },
        [props.waveform, props.player, $footer],
    );

    useEffect(() => {
        const onWheelThrottle = throttle(onWheel, 100);
        window.addEventListener('wheel', onWheelThrottle);
        return () => window.removeEventListener('wheel', onWheelThrottle);
    }, [onWheel]);

    return (
        <Style className='footer' ref={$footer}>
            {props.player ? (
                <React.Fragment>
                    <Progress {...props} />
                    <Duration {...props} />
                    <Waveform {...props} setRender={setRender} />
                    <Grab {...props} render={render} />
                    <Metronome {...props} render={render} />
                    <Timeline {...props} render={render} />
                </React.Fragment>
            ) : null}
        </Style>
    );
}
