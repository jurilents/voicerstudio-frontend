import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Translate } from 'react-i18nify';
import styled from 'styled-components';
import backlight from '../../libs/backlight';
import { VideoWrap } from './VideoWrap';
import { AudioWrap } from './AudioWrap';

const Style = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 50%;
  width: 100%;
  padding: 2% 2%;

  .video {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    max-width: 100%;
    height: 100%;
    max-height: 100%;

    video {
      position: relative;
      z-index: 10;
      outline: none;
      height: 100%;
      max-height: 100%;
      max-width: 100%;
      box-shadow: 0 5px 25px 5px rgb(0 0 0 / 80%);
      background-color: #000;
      cursor: pointer;
    }

    .subtitle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      z-index: 20;
      left: 0;
      right: 0;
      bottom: 5%;
      width: 100%;
      padding: 0 20px;
      user-select: none;
      pointer-events: none;

      .operate {
        padding: 5px 15px;
        color: #fff;
        font-size: 13px;
        border-radius: 3px;
        margin-bottom: 5px;
        background-color: rgb(0 0 0 / 75%);
        border: 1px solid rgb(255 255 255 / 20%);
        cursor: pointer;
        pointer-events: all;
      }

      .textarea {
        width: 100%;
        outline: none;
        resize: none;
        text-align: center;
        line-height: 1.2;
        border: none;
        color: #fff;
        font-size: 20px;
        padding: 5px 10px;
        user-select: all;
        pointer-events: all;
        background-color: rgb(0 0 0 / 0);
        text-shadow: rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px,
        rgb(0 0 0) 0px -1px 1px;

        &.pause {
          background-color: rgb(0 0 0 / 50%);
        }
      }
    }
  }
`;

export default function Player(props) {
  const [currentSub, setCurrentSub] = useState(null);
  const [focusing, setFocusing] = useState(false);
  const [inputItemCursor, setInputItemCursor] = useState(0);
  const $player = createRef();

  useEffect(() => {
    if ($player.current && props.player && !backlight.state) {
      backlight.state = true;
      backlight($player.current, props.player);
    }
  }, [$player, props.player]);

  useMemo(() => {
    const sub = props.subtitle.find(x => x.id === props.settings.currentSubtitle);
    setCurrentSub(sub?.id || -1);
  }, [props.subtitle, props.settings]);

  const onChange = useCallback(
    (event) => {
      props.player.pause();
      props.updateSub(currentSub, { text: event.target.value });
      if (event.target.selectionStart) {
        setInputItemCursor(event.target.selectionStart);
      }
    },
    [props, currentSub],
  );

  const onClick = useCallback(
    (event) => {
      props.player.pause();
      if (event.target.selectionStart) {
        setInputItemCursor(event.target.selectionStart);
      }
    },
    [props],
  );

  const onFocus = useCallback((event) => {
    setFocusing(true);
    if (event.target.selectionStart) {
      setInputItemCursor(event.target.selectionStart);
    }
  }, []);

  const onBlur = useCallback(() => {
    setTimeout(() => setFocusing(false), 500);
  }, []);

  const onSplit = useCallback(() => {
    props.splitSub(currentSub, inputItemCursor);
  }, [props, currentSub, inputItemCursor]);

  return (
    <Style className='player'>
      <div className='video' ref={$player}>
        <AudioWrap {...props} />
        <VideoWrap {...props} />
        {props.player && currentSub ? (
          <div className='subtitle'>
            {focusing ? (
              <div className='operate' onClick={onSplit}>
                <Translate value='SPLIT' />
              </div>
            ) : null}
            <TextareaAutosize
              className={`textarea ${!props.playing ? 'pause' : ''}`}
              value={currentSub.text}
              onChange={onChange}
              onClick={onClick}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onFocus}
              spellCheck={false}
            />
          </div>
        ) : null}
      </div>
    </Style>
  );
}