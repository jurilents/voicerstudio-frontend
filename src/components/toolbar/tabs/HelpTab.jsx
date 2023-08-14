import React from 'react';
import styled from 'styled-components';
import { Col, Container, Row } from 'react-bootstrap';
import { settings } from '../../../settings';

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
          <Col>Record subtitle</Col>
          <Col><span className='hotkey-key'>R (hold)</span></Col>
        </Row>
        <Row>
          <Col>Paste copied text to selected subtitle</Col>
          <Col><span className='hotkey-key'>⌘ + V</span></Col>
        </Row>
        <Row className='mt-3'>
          <Col>Undo</Col>
          <Col><span className='hotkey-key'>⌘ + Z</span></Col>
        </Row>
        <Row>
          <Col>Redo</Col>
          <Col><span className='hotkey-key'>⌘ + ⇧ + Z</span></Col>
        </Row>
        <Row className='mt-4'>
          <Col>Move backward</Col>
          <Col><span className='hotkey-key'>(⇧) + ←</span></Col>
        </Row>
        <Row>
          <Col>Move forward</Col>
          <Col><span className='hotkey-key'>(⇧) + →</span></Col>
        </Row>
        <Row className='mt-4'>
          <Col>Add/remove marker</Col>
          <Col><span className='hotkey-key'>M</span></Col>
        </Row>
        <Row>
          <Col>Move to prev marker</Col>
          <Col><span className='hotkey-key'>⌥ + ←</span></Col>
        </Row>
        <Row>
          <Col>Move to next marker</Col>
          <Col><span className='hotkey-key'>⌥ + →</span></Col>
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
            <a href={'https://t.me/' + settings.supportTelegram}
               target='_blank'
               rel='noreferrer'
               className='hotkey-key'>
              @{settings.supportTelegram}
            </a>
          </Col>
        </Row>
      </Container>
    </Style>
  );
}
