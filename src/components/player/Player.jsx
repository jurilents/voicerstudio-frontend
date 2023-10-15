import React from 'react';
import styled from 'styled-components';
import VideoWrap from './VideoWrap';
import Actions from './Actions';
import {borderRadius} from '../../styles/constants';

const Style = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
  width: 100%;
  min-width: 280px;
  padding: 2% 2%;

  .video {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    max-width: 100%;
    height: 100%;
    //max-height: 100%;
    max-height: 60vh;
    border-radius: ${borderRadius};

    video {
      position: relative;
      z-index: 10;
      outline: none;
      height: 100%;
      max-height: 100%;
      max-width: 100%;
      box-shadow: 0 5px 25px 5px rgb(0 0 0 / 80%);
      background-color: #000;
      border-radius: ${borderRadius};
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
      bottom: 10%;
      width: 100%;
      padding: 0 20px;
      user-select: none;
      pointer-events: none;

      .operate {
        padding: 5px 15px;
        color: #fff;
        font-size: 13px;
        border-radius: ${borderRadius};
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
  return (
    <Style className='player'>
      <div className='video'>
        <VideoWrap {...props} />
        <Actions {...props} />
      </div>
    </Style>
  );
}
