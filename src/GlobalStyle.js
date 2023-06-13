import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  //@import '/node_modules/bootstrap/dist/css/bootstrap.min.css';

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
  }

  .noselect {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
`;
