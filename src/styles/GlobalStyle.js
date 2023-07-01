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
    background-color: rgb(0 0 0 / 90%);
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
