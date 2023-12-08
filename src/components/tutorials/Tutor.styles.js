import {createGlobalStyle} from 'styled-components';
import {borderRadius} from '../../styles/constants';
import 'intro.js/introjs.css';

export default createGlobalStyle`
  .introjs-tooltip {
    --tooltip-bg: var(--c-primary);
    background-color: var(--tooltip-bg);
    border-radius: ${borderRadius};
    color: #fff;
    transition: all 0.2s ease 0s;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
    min-width: 350px;
    max-width: 400px;

    .introjs-tooltiptext {
      a {
        color: white;
        text-decoration: underline;
      }

      code {
        color: var(--c-text);
        font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        background: rgba(255, 255, 255, 0.2);
      }

      br {
        display: block;
        margin-top: 10px;
        content: " ";
      }
    }
  }

  .introjs-arrow.top, .introjs-arrow.top-middle, .introjs-arrow.top-right, .introjs-arrow.top-left {
    border-bottom-color: var(--tooltip-bg);
  }

  .introjs-arrow.bottom, .introjs-arrow.bottom-middle {
    border-top-color: var(--tooltip-bg);
  }

  .introjs-arrow.left, .introjs-arrow.left-middle {
    border-right-color: var(--tooltip-bg);
  }

  .introjs-arrow.right, .introjs-arrow.right-middle {
    border-left-color: var(--tooltip-bg);
  }

  .introjs-tooltipbuttons {
    border-top: 1px solid rgba(255, 255, 255, .5);
  }

  .introjs-skipbutton {
    color: #fff !important;
    opacity: 40%;

    &:hover {
      opacity: 90%;
    }
  }

  .introjs-button {
    --bg-color: var(--c-primary-light);
    --bg-color-active: var(--c-danger);
    --text-color: #fff;
    opacity: 85%;
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

  .tutor-highlight {
    box-shadow: rgb(174 174 174 / 80%) 0 0 1px 2px, rgb(0 0 0 / 50%) 0 0 0 5000px !important;
  }
`;
