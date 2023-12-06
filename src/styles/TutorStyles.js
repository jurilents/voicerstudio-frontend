import {createGlobalStyle} from 'styled-components';
import {borderRadius} from './constants';
import 'intro.js/introjs.css';

export default createGlobalStyle`
  .introjs-tooltip {
    background-color: #333;
    border-radius: ${borderRadius};
    color: #fff;
    transition: all 0.2s ease 0s;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  .introjs-arrow.top {
    border-bottom-color: #333;
  }

  .introjs-arrow.bottom {
    border-top-color: #333;
  }

  .introjs-arrow.left {
    border-right-color: #333;
  }

  .introjs-arrow.right {
    border-left-color: #333;
  }

  .introjs-tooltipbuttons {
    border-top: 1px solid rgba(255, 255, 255, .5);
  }

  .introjs-skipbutton {
    color: #999 !important;
    opacity: 85%;

    &:hover {
      opacity: 40%;
    }
  }

  .introjs-button {
    --bg-color: var(--c-primary-light);
    --bg-color-active: var(--c-primary);
    --text-color: #fff;
    opacity: 0.85;
    border-radius: ${borderRadius};
    color: var(--text-color);
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease 0s;
    border: none;
    background-color: var(--bg-color);
    text-shadow: none;

    &:hover {
      color: var(--text-color);
      background-color: var(--bg-color-active);
    }

    &:focus, &:active {
      color: var(--text-color);
      outline: none;
      border: none;
      background-color: var(--bg-color);
      box-shadow: none;
    }
  }
`;
