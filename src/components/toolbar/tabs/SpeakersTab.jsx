import React from 'react';
import styled from 'styled-components';
import { useSettings } from '../../../hooks';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addSpeaker, patchSpeaker, removeSpeaker, selectSpeaker } from '../../../store/sessionReducer';
import { Speaker } from '../../../models';
import colors from '../../../utils/colors';

const Style = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  height: 100%;

  .color-preview {
    width: 10px;
    min-width: 10px;
    height: 10px;
    min-height: 10px;
    margin: auto 5px;
    border-radius: 50%;
  }

  .speaker-form {
    border-top: 1px solid rgb(255 255 255 / 30%);
    padding-top: 20px;

    .row {
      align-items: center;
      margin-bottom: 10px;
    }

    .label {
      text-align: right;
    }
  }
`;

export default function SpeakersTab(props) {
  const { settings, patchSettings } = useSettings();
  const dispatch = useDispatch();
  const speakers = useSelector(store => store.session.speakers);
  const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);
  let maxSpeakerId = useSelector(store => Math.max.apply(null, store.session.speakers.map(x => x.id)));

  const createSpeaker = () => new Speaker({
    id: ++maxSpeakerId,
    displayName: '',
    color: colors.blue,
  });

  return (
    <Style className='tab-outlet'>
      <div>
        <h3>Speakers</h3>
        <ListGroup>
          {speakers.map((speaker) => (
            <ListGroup.Item
              className={(selectedSpeaker?.id && speaker.id === selectedSpeaker.id ? 'selected' : '')}
              key={speaker.id}
              onClick={() => dispatch(selectSpeaker(speaker.id))}>
              <div className='color-preview' style={{ backgroundColor: speaker.color || '#000' }}></div>
              <input className='list-item-text'
                     type='text'
                     value={speaker.displayName}
                     onChange={(event) =>
                       dispatch(patchSpeaker(speaker.id, { displayName: event.target.value }))} />
              <span className='list-item-actions'>
            <button
              className='btn'
              onClick={() => dispatch(removeSpeaker(speaker.id))}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </span>
            </ListGroup.Item>
          ))}
          <ListGroup.Item>
            <button
              className='btn add-button'
              onClick={() => dispatch(addSpeaker(createSpeaker()))}>
              <FontAwesomeIcon icon={faAdd} />
            </button>
          </ListGroup.Item>
        </ListGroup>
      </div>
      <Container className='speaker-form'>
        <Row>
          <Col className='label'>Color</Col>
          <Col>
            <Form.Select
              className='app-select'
              defaultValue={selectedSpeaker?.color}
              style={{ backgroundColor: selectedSpeaker?.color || 'rgb(255 255 255 / 60%)' }}
              onChange={(event) =>
                dispatch(patchSpeaker(selectedSpeaker.id, { color: event.target.value }))}>
              {Object.entries(colors).map(([name, value], index) => (
                <option key={index} value={value}>
                  {name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col className='label'>Speaker Preset</Col>
          <Col>
            <Form.Select
              className='app-select'
              defaultValue={selectedSpeaker.color}>
              {Object.entries(colors).map(([name, value], index) => (
                <option key={index} value={value}>
                  {name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Container>
    </Style>
  );
}
