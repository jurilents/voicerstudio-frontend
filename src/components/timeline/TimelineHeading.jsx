import React from 'react';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
import timelineStyles from './timelineStyles';
import { useSelector } from 'react-redux';

const Style = styled.div`
  //position: fixed;
  //top: 0;
  //left: 0;
  //right: 0;
  //z-index: 999;
  width: ${timelineStyles.headingWidth};
  height: 100%;
  //user-select: none;
  //pointer-events: none;

  .inner {
    position: relative;
    height: 100%;
    background-color: #f00;
    transition: all 0.3s ease 0s;

    span {
      position: absolute;
      top: 3px;
      right: 0;
      padding: 2px 5px;
      color: #fff;
      font-size: 12px;
      background-color: rgb(0 0 0 / 80%);
    }
  }

  .app-list-group {
    flex-direction: column-reverse;
  }

  .list-group-item {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px !important;
    border: 1px solid transparent;
    border-right: 10px solid transparent;
  }

  .speaker-btn {
    background-color: rgb(255 255 255 / 10%);

    &:hover {
      background-color: var(--c-primary-dark);
    }
  }

  .grab-filler {
    height: 12%;
    width: 100%;
  }
`;

export default function TimelineHeading() {
  const speakers = useSelector(store => store.session.speakers);

  return (
    <Style className='timeline-heading'>
      <div className='grab-filler'></div>
      <ListGroup className='app-list-group'>
        {speakers.map((speaker, index) => (
          <ListGroup.Item key={index} style={{ borderColor: speaker.color }}>
            <div className='speaker-actions'>
              <button className='btn speaker-btn'>M</button>
            </div>
            <div>{speaker.displayName}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Style>
  );
}
