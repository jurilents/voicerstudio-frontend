import React from 'react';
import styled from 'styled-components';
import { Col, Row } from 'react-bootstrap';

const Style = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px 10% 0 0;
  gap: 10px;

  .col:first-child {
    text-align: right;
  }

  .hotkey-key {
    display: block;
    max-width: 150px;
    font-size: 13px;
    padding: 5px 20px;
    border-radius: 3px;
    text-align: center;
    color: rgb(255 255 255 / 75%);
    background-color: rgb(255 255 255 / 20%);
  }
`;

export default function HelpTab() {
  return (
    <Style className='hotkey'>
      <Row>
        <Col>Play/Pause</Col>
        <Col><span className='hotkey-key'>Space</span></Col>
      </Row>
      <Row>
        <Col>Undo</Col>
        <Col><span className='hotkey-key'>⌘ + Z</span></Col>
      </Row>
    </Style>
  );
}
