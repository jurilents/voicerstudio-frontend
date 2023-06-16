import styled from 'styled-components';
import React from 'react';

const Style = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 50%);
  border-left: 1px solid rgb(255 255 255 / 20%);

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
    <Style className='header'>
      <nav>
        <ul>
          <li>
            <a href='/voice-studio'>Voice Studio</a>
          </li>
          <li>
            <a href='/video-studio'>4Video</a>
          </li>
        </ul>
      </nav>
    </Style>
  );
}
