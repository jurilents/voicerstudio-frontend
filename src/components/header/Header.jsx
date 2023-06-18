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

  .version {
    opacity: 33%;
  }
`;

export default function Header() {

  return (
    <Style className='header'>
      <nav>
        <ul>
          <li>
            <a href='/'>Voicer Studio</a>
          </li>
        </ul>
      </nav>
      <div>
        <span className='version'>v0.0.0-demo1 18/06/23</span>
      </div>
    </Style>
  );
}
