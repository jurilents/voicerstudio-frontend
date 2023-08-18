import { createGlobalStyle } from 'styled-components';
import './_inputs.css';
import palette from './palette';

export default createGlobalStyle`
  :root {
    --c-primary: ${palette.colors.primary};
    --c-primary-dark: ${palette.colors.primaryDark};
    --c-primary-light: ${palette.colors.primaryLight};
    --c-success: ${palette.colors.success};
    --c-danger: ${palette.colors.danger};
    --c-warn: ${palette.colors.warn};

    accent-color: ${palette.colors.primary};
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
    line-height: 1.5;
    overflow: hidden;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  #root {
    display: flex;
    font-size: 14px;
    color: #ccc;
    background-color: rgb(50 50 50);
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #999;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #ccc;
  }

  .btn {
    position: relative;
    opacity: 0.85;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 100%;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease 0s;
    border: none;

    &:hover {
      opacity: 1;
    }

    &.btn-primary {
      background-color: var(--c-primary);

      &:hover {
        background-color: var(--c-primary-dark);
      }
    }

    &.btn-outline {
      border: 2px solid var(--c-primary);

      &:hover {
        background-color: var(--c-primary);
      }
    }

    &.btn-outline-disabled:disabled {
      background-color: transparent;
      border: 2px solid var(--c-primary);
    }
  }

  .icon-btn {
    color: #fff;
    font-size: 12px;
  }

  .noselect, .btn-icon {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  .app-select {
    min-width: 160px;
    border-radius: 1px;
    border-color: rgb(255 255 255 / 30%);
    color: #ffffff;
    background-color: transparent;
    margin-right: 10px;
    font-size: inherit;
  }

  .app-input {
    height: 35px;
    border-radius: 1px;
    border-color: rgb(255 255 255 / 30%);
    color: #ffffff;
    background-color: transparent;
    padding: 3px 10px;
    //margin-right: 10px;
    font-size: inherit;
  }

  .app-list-group {
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

    .list-item-input {
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

    .list-item-text {
      margin: auto 5px;
      opacity: 66%;
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

  .ReactModal__Overlay {
    z-index: 1111;
    background-color: rgba(42, 42, 42, 0.9) !important;
    border: none !important;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20vh;

    .ReactModal__Content {
      background-color: rgb(20 20 25 / 80%) !important;
      border: none !important;
      color: white;
      padding: 20px 50px 60px 50px !important;
      min-width: 50%;
      //inset: none !important;
    }

    .btn-modal {
      font-size: 16px;
    }

    .app-input {
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:focus {
        background-color: inherit;
        color: inherit;
      }
    }

    h2 {
      text-align: center;
    }
  }

  .modal-container {
    max-width: 500px;

    input, select {
      min-width: 300px;
      //width: 300px;
      margin: 0;
    }
  }

  .label {
    text-align: right;
    margin: auto 0;
  }

  .btn-app-close {
    font-size: 24px;
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    background: none;
    border: none;
    opacity: 0.75;
    transition: opacity 0.1s ease;

    &:hover {
      opacity: 1;
      transition: opacity 0.1s ease;
    }
  }

  input[type=checkbox].form-check-input {
    border-radius: 0 !important;
    background-color: transparent;
    border: 1px solid rgb(255 255 255 / 33%);
    /* width: 30px; */
    min-width: 20px;
    display: inline-block;
    aspect-ratio: 1;
    height: auto;

    &:focus {
      border-color: var(--c-primary-dark);
      box-shadow: none;
    }

    &:checked {
      background-color: var(--c-primary);
      border-color: var(--c-primary);
    }
  }

  input[type=range] {
    width: 100%;
    min-width: 100%;
    height: 24px;
    margin-top: 4px;
  }

  input[type=checkbox] {
    cursor: pointer;
  }

  .speaker-form {
    .row {
      margin-bottom: 10px;
    }
  }

  .custom-input-wrap {
    height: 38px;
    display: flex;
    align-items: center;
  }

  .text-to-voice {
    width: 100%;
    background-color: transparent;
    color: white;
    padding: 10px;
    min-height: 60px;
    max-height: 200px;
  }

  option {
    color: white !important;
    background-color: rgb(0 0 0 / 95%);
    border: none;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    &:checked {
      background-color: var(--c-primary-dark);
    }
  }

  .app-reset-btn {
    transform: rotateY(180deg) rotateZ(30deg);
    display: block;
    border: none;
    outline: none;
    background-color: rgb(255 255 255 / 10%);
    border-radius: 50%;
    padding: 5px 0 4px 0;
    min-width: 25px;
    width: 15px;
    color: white;
    font-size: 13px;

    &:hover {
      background-color: var(--c-primary);
    }
  }

  .file {
    border-radius: 1px;
    background-color: transparent;
    color: white;
    border: 1px solid rgb(255 255 255 / 25%);

    &::file-selector-button {
      background-color: rgb(255 255 255 / 10%);
      color: white;
    }

    &:hover, &:focus {
      background-color: inherit !important;
      color: inherit !important;

      &::file-selector-button {
        background-color: rgb(255 255 255 / 25%) !important;
      }
    }
  }
`;
