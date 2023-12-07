import styled from 'styled-components';
import {borderRadius} from '../../styles/constants';

export const Style = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px 5px 10px;
  position: relative;
  //overflow: hidden;
  background-color: rgba(0, 0, 0, 50%);
  height: 60px;

  .logo {
    width: 190px;
    height: 90%;
    //color: white;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    img {
      max-height: 100%;
      margin-right: -5px;
    }

    .logo-content {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
    }

    .logo-title {
      font-size: 16px;
      padding-top: 5px;
      font-weight: bold;
    }

    .logo-version {
      opacity: 50%;
      font-size: 11px;
    }
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 20px;
    margin-bottom: 0;

    li {
      opacity: 60%;
      transition: all 0.2s ease 0s;
      cursor: pointer;
      text-align: center;

      &:hover {
        opacity: 100%;
      }
    }

    a, button {
      color: white;
      text-decoration: none;
      text-wrap: nowrap;
    }
  }

  .welcome-tour-btn {
    opacity: 80%;

    button {
      color: var(--bs-warning);
    }
  }

  .nav-toggler-btn {
    font-size: 20px;
  }

  .nav-wrapper {
    position: relative;
  }

  .nav-collapsed {
    display: block;
    position: absolute;
    right: 55px;
    bottom: -130px;
    z-index: 2000;

    &.hidden {
      display: none;
    }

    ul {
      flex-direction: column-reverse;
      justify-content: flex-start;
      gap: 0;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: ${borderRadius};
      padding: 0;
      width: 180px;
      //margin-bottom: 0;

      li {
        opacity: 80%;
        transition: all 0.2s ease 0s;
        cursor: pointer;
        text-align: center;
        background-color: #1d1d1d;
        padding: 10px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
          opacity: 100%;
        }

        &:first-child {
          border-bottom-left-radius: ${borderRadius};
          border-bottom-right-radius: ${borderRadius};
        }

        &:last-child {
          border-top-left-radius: ${borderRadius};
          border-top-right-radius: ${borderRadius};
          border-top: none;
        }
      }
    }
  }
`;
