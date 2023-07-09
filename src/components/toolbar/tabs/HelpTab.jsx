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
          <Col>Delete subtitle</Col>
          <Col><span className='hotkey-key'>Backspace</span></Col>
        </Row>
        <Row>
          <Col>Paste text from clipboard</Col>
          <Col><span className='hotkey-key'>⌘ + V</span></Col>
        </Row>
        <Row>
          <Col>Undo</Col>
          <Col><span className='hotkey-key'>⌘ + Z</span></Col>
        </Row>
        <Row>
          <Col>Redo</Col>
          <Col><span className='hotkey-key'>⌘ + ⇧ + Z</span></Col>
        </Row>
        <Row>
          <Col>Move forward</Col>
          <Col><span className='hotkey-key'>(⇧) + →</span></Col>
        </Row>
        <Row>
          <Col>Move backward</Col>
          <Col><span className='hotkey-key'>(⇧) + ←</span></Col>
        </Row>
      </Container>
      <div className='offset'></div>
      <h3>Support</h3>
      <Container>
        <Row>
          <Col>Any questions (priority)</Col>
          <Col>
            <a href='https://t.me/Lisa_Volkova'
               target='_blank'
               rel='noreferrer'
               className='hotkey-key'>
              @Lisa_Volkova
            </a>
          </Col>
        </Row>
        <Row>
          <Col>Bugs / Technical support</Col>
          <Col>
            <a href='https://t.me/jurilents'
               target='_blank'
               rel='noreferrer'
               className='hotkey-key'>
              @jurilents
            </a>
          </Col>
        </Row>
      </Container>
    </Style>
  );
}
