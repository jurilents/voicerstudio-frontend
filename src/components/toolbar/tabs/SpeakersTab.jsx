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

  .list-group {
    width: 100%;
    border-radius: 0;

    .list-group-item {
      display: flex;
      justify-content: space-between;
      background-color: transparent;
      color: var(--c-text);
      border-color: rgb(255 255 255 / 20%);
      padding: 5px;

      &:focus-within, &.selected {
        //background-color: var(--c-primary-dark);
        background-color: rgb(255 255 255 / 10%);
      }

      &:hover {
        .list-item-actions {
          opacity: 100%;
        }
      }
    }

    .list-item-text {
      width: 100%;
      outline: none;
      resize: none;
      line-height: 1.2;
      border: none;
      color: #fff;
      font-size: 14px;
      padding: 5px 10px;
      user-select: all;
      pointer-events: all;
      background-color: transparent;
    }

    .list-item-actions {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      opacity: 50%;
    }

    .add-button {
      font-size: 18px;
      opacity: 80% !important;

      &:hover {
        opacity: 100%;
      }
    }
  }

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

  .form-select {
    border-radius: 1px;
    border-color: rgb(255 255 255 / 30%);
    color: #ffffff;
    background-color: transparent;
    margin-right: 10px;
    font-size: inherit;
  }
`;

export default function SpeakersTab(props) {
  const { settings, patchSettings } = useSettings();
  const dispatch = useDispatch();
  const speakers = useSelector(store => store.session.speakers);
  const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);
  let maxId = useSelector(store => Math.max.apply(null, store.session.speakers.map(x => x.id)));

  const createSpeaker = () => new Speaker({
    id: ++maxId,
    name: '',
    color: colors.blue,
  });

  return (
    <Style className='speakers'>
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
                     value={speaker.name}
                     onChange={(event) =>
                       dispatch(patchSpeaker(speaker.id, { name: event.target.value }))} />
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
              defaultValue={selectedSpeaker.color}
              style={{ backgroundColor: selectedSpeaker.color || 'rgb(255 255 255 / 60%)' }}
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
