import styled from 'styled-components';

export const Style = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: hidden;

  .timeline-editor {
    width: 100%;
    z-index: 100;
    background-color: transparent;
  }

  .timeline-editor-action-right-stretch,
  .timeline-editor-action-left-stretch {
    //z-index: 1000;
  }

  .timeline-editor-action {
    z-index: 100;
    cursor: grab;
    --shadow-size: 5px;
    --shadow-size-minus: -5px;

    &:before, &:after {
      content: " ";
      height: 100%;
      position: absolute;
      top: 0;
      width: var(--shadow-size);
    }

    &:before {
      box-shadow: black -6px 0 var(--shadow-size) var(--shadow-size-minus) inset;
      left: var(--shadow-size-minus);
    }

    &:after {
      box-shadow: black 6px 0 var(--shadow-size) var(--shadow-size-minus) inset;
      right: var(--shadow-size-minus);
    }


    &:has(.selected-sub) {
      z-index: 500;
    }
  }

  .timeline-editor-action {
    background-color: transparent;
  }

  .timeline-sub {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    opacity: 50%;
    border: 1px solid transparent;
    border-bottom: 4px solid inherit;

    &.focus-sub {
      opacity: 100%;
    }

    &.selected-sub {
      border-color: rgba(180, 180, 180, 0.8);
    }

    &.illegal {
      //border-color: var(--c-danger);
      box-shadow: 0 0 0 2px var(--c-danger);
    }

    .sub-text {
      display: block;
      width: calc(100% - 10px);
      line-height: 1.8;
      margin-top: 3px;
      text-align: center;
      font-size: 13px;
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-footer {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sub-time {
      font-size: 10px;
      opacity: 60%;
    }

    .sub-status {
      display: inline-block;
      width: 8px;
      height: 8px;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 1px solid rgb(255 255 255 / 50%);
    }
  }

  .recording-sub {
    border-color: rgba(220, 0, 0, 0.5) !important;
    border-width: 2px;
    //border-right: 1px solid white;
    //border-left: 1px solid #ff7272;
  }

  .timeline-audio {
    width: 100%;

    wave {
      overflow: hidden !important;
    }
  }

  .timeline-editor-cursor-top {
    top: -7px !important;
    transform: translate(-50%, 0) scaleX(2) scaleY(1.4) !important;
    height: 30px !important;
  }

  .waveform-row {
    z-index: 1;
  }

  .markers-row {
    .timeline-marker {
      position: absolute;
      top: -20px;
      z-index: 100;
      filter: brightness(175%);
    }

    .marker-title {
      font-size: 11px;
      text-wrap: nowrap;
      position: absolute;
      top: 20px;
      left: 5px;
      font-weight: bold;
    }
  }
`;
