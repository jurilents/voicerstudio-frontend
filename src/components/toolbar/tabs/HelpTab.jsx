import React from 'react';
import styled from 'styled-components';
import { Col, Container, Row } from 'react-bootstrap';

const Style = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  .row {
    margin-bottom: 10px;
  }

  .col:first-child {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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

  .offset {
    height: 30px;
  }
`;

export default function HelpTab() {
  return (
    <Style className='hotkey'>
      <h3>Hotkeys</h3>
      <Container>
        <Row>
          <Col>Play/Pause</Col>
          <Col><span className='hotkey-key'>Space</span></Col>
        </Row>
        <Row>
          <Col>Undo</Col>
          <Col><span className='hotkey-key'>⌘ + Z</span></Col>
        </Row>
      </Container>
      <div className='offset'></div>
      <h3>Support</h3>
      <Container>
        <Row>
          <Col>Any questions</Col>
          <Col>
            <a href='https://t.me/Lisa_Volkova' target='_blank' className='hotkey-key'>@Lisa_Volkova</a>
          </Col>
        </Row>
        <Row>
          <Col>Bugs</Col>
          <Col>
            <a href='https://t.me/jurilents' target='_blank' className='hotkey-key'>@jurilents</a>
          </Col>
        </Row>
      </Container>
    </Style>
  );
}