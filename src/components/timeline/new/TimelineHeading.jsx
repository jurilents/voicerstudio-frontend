import React from 'react';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
import timelineStyles from '../timelineStyles';
import { useDispatch, useSelector } from 'react-redux';
import { selectSpeaker } from '../../../store/sessionReducer';

const Style = styled.div`
  width: ${timelineStyles.headingWidth};
  height: 100%;
  padding: 42px 0 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

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
    flex-direction: column;
  }

  .list-group-item {
    //height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px !important;
    border: 1px solid transparent;
    border-right: 3px solid transparent;
    cursor: pointer;

    &.selected-speaker {
      background-color: rgb(255 255 255 / 10%);
      border-right-width: 10px;
    }
  }

  .speaker-btn {
    background-color: rgb(255 255 255 / 10%);

    &:hover {
      background-color: var(--c-primary-dark);
    }
  }
`;

export const TimelineHeading = () => {
  const dispatch = useDispatch();
  const { speakers, selectedSpeaker } = useSelector(store => store.session);
  const timelineRowHeight = useSelector(store => store.settings.timelineRowHeight);

  return (
    <Style className='timeline-heading'>
      <ListGroup className='app-list-group'>
        <ListGroup.Item
          style={{ borderColor: '#5e5e5e', height: timelineRowHeight }}>
          <div className='speaker-actions'>
            <button className='btn speaker-btn'>M</button>
          </div>
          <div>Original Audio</div>
        </ListGroup.Item>
        {speakers.map((speaker, index) => (
          <ListGroup.Item
            key={index}
            className={selectedSpeaker.id === speaker.id ? 'selected-speaker' : ''}
            style={{ borderColor: speaker.color, height: timelineRowHeight }}
            onClick={() => dispatch(selectSpeaker(speaker.id))}>
            <div className='speaker-actions'>
              <button className='btn speaker-btn'>M</button>
            </div>
            <div>{speaker.displayName}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Style>
  );
};
