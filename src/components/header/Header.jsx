import styled from 'styled-components';
import React from 'react';

const Style = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px 5px 10px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 50%);
  border-left: 1px solid rgb(255 255 255 / 20%);
  height: 60px;

  .logo {
    //width: auto;
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

    li {
      opacity: 60%;
      transition: all 0.2s ease 0s;
      cursor: pointer;

      &:hover {
        opacity: 100%;
      }
    }

    a {
      color: white;
      text-decoration: none;
    }
  }
`;

export default function Header() {

  return (
    <Style className='header noselect'>
      <div className='logo'>
        <img src='/images/logo-silver.png' alt='Creative Society' />
        <div className='logo-content'>
          <span className='logo-title'>Voicer Studio</span>
          <span className='logo-version'>v0.0.0-demo2 20/06/23</span>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <a href='https://text2aspeech.azurewebsites.net/ru/app'>Text 2 Speech</a>
          </li>
        </ul>
      </nav>
    </Style>
  );
}