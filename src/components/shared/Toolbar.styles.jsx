import styled from 'styled-components';
import { borderRadius } from '../../styles/constants';

export const Style = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  //padding-bottom: 15px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 50%);
  //border-left: 1px solid rgb(255 255 255 / 20%);
  width: 100%;
  height: 100%;

  .tab-content {
    width: 100%;
    height: 100%;
    min-height: 130px;
    margin-bottom: 5px;
    overflow-y: auto;
  }

  .tab-outlet {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: nowrap;
    height: 100%;

    .row {
      margin-bottom: 10px;
    }

    .col:first-child {
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .tab-pane {
    height: 100%;
    padding: 10px 10px 20px 10px;

    &.compact-tab {
      padding: 0;
    }
  }

  .tabs-buttons {
    justify-content: center;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    .nav-link {
      cursor: pointer;
      border-radius: ${borderRadius};
      padding: 10px 12px;
      color: white;

      &.active {
        background-color: var(--c-primary);
      }
    }
  }

  h3 {
    border-bottom: 1px solid rgb(255 255 255 / 30%);
    padding-bottom: 5px;
    margin: 10px 0 20px 0;
    font-size: 20px;
    text-align: center;
  }

  .import {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    gap: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    .btn {
      background-color: var(--c-primary);
    }

    .secondary {
      background-color: #009688;
    }

    .file {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .burn {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    .btn {
      background-color: #673ab7;
    }
  }

  .export {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);
  }

  .operate {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    .btn {
      width: 48%;
      background-color: #009688;
    }
  }

  .translate {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgb(255 255 255 / 20%);

    select {
      width: 65%;
      outline: none;
      padding: 0 5px;
      border-radius: ${borderRadius};
    }

    .btn {
      width: 33%;
      background-color: #673ab7;
    }
  }

  .bottom {
    padding: 10px;

    a {
      display: flex;
      flex-direction: column;
      border: 1px solid rgb(255 255 255 / 30%);
      text-decoration: none;

      .title {
        color: #ffeb3b;
        padding: 5px 10px;
        animation: animation 3s infinite;
        border-bottom: 1px solid rgb(255 255 255 / 30%);
      }

      @keyframes animation {
        50% {
          color: #00bcd4;
        }
      }

      img {
        max-width: 100%;
      }
    }
  }

  .progress {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 9;
    height: 2px;
    background-color: rgb(0 0 0 / 50%);

    span {
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0;
      height: 100%;
      background-color: #ff9800;
      transition: all 0.2s ease 0s;
    }
  }

  .btn.active {
    background-color: #3f51b5;
  }

  .range-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    min-width: 200px;
    width: 200px;

    input {
      width: 140px;
      min-width: 140px;
      max-width: 140px;
    }
  }
`;
