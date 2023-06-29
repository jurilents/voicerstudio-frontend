import styled from 'styled-components';

export const Style = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  //padding-bottom: 15px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 50%);
  border-left: 1px solid rgb(255 255 255 / 20%);
  max-width: 400px;

  .tab-content {
    min-height: 130px;
    padding: 10px 10px 20px 10px;
    height: 100%;
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
  }

  .tabs-buttons {
    justify-content: center;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    .nav-link {
      cursor: pointer;
      border-radius: 0;
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
    margin-bottom: 20px;
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
      border-radius: 3px;
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

  .list-group {
    width: 100%;
    border-radius: 0;

    .list-group-item {
      display: flex;
      justify-content: space-between;
      background-color: transparent;
      color: var(--c-text);
      border-color: rgb(255 255 255 / 20%);
      padding: 5px;

      &:focus-within, &.selected {
        //background-color: var(--c-primary-dark);
        background-color: rgb(255 255 255 / 10%);
      }

      &:hover {
        .list-item-actions {
          opacity: 100%;
        }
      }
    }

    .list-item-text {
      width: 100%;
      outline: none;
      resize: none;
      line-height: 1.2;
      border: none;
      color: #fff;
      font-size: 14px;
      padding: 5px 10px;
      user-select: all;
      pointer-events: all;
      background-color: transparent;
    }

    .list-item-actions {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      opacity: 50%;
    }

    .add-button {
      font-size: 18px;
      opacity: 80% !important;

      &:hover {
        opacity: 100%;
      }
    }
  }
`;
