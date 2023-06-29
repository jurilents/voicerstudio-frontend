import React from 'react';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
import timelineStyles from './timelineStyles';

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
`;

export default function TimelineHeading() {
  return (
    <Style className='timeline-heading'>
      <ListGroup>
        <ListGroup.Item>
          Speaker 1
        </ListGroup.Item>
      </ListGroup>
    </Style>
  );
}
