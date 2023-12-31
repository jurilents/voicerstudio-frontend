import React from 'react';
import styled from 'styled-components';
import {Col, Container, Form, ListGroup, Row} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAdd, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from 'react-redux';
import {addSpeaker, patchSpeaker, removeSpeaker, selectSpeaker} from '../../../store/sessionReducer';
import {Speaker} from '../../../models';
import colors from '../../../utils/colors';
import {useTranslation} from 'react-i18next';

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

  .file-wrapper {
    padding: 0 12px 0 0;
  }
`;

export default function SpeakersTab(props) {
  const dispatch = useDispatch();
  const session = useSelector((store) => store.session);
  const {t} = useTranslation();
  const {speakers, presets, selectedSpeaker} = session;
  let maxSpeakerId = useSelector((store) =>
    Math.max.apply(
      null,
      store.session.speakers.map((x) => x.id),
    ),
  );
  if (!maxSpeakerId || maxSpeakerId < 0 || maxSpeakerId > 100) {
    maxSpeakerId = 0;
  }

  const createSpeaker = () =>
    new Speaker({
      id: ++maxSpeakerId,
      displayName: '',
      color: colors.teal,
      preset: presets?.length ? presets[0] : null,
    });

  // const importSubs = (event) => {
  //   function handleFileLoaded(event) {
  //     session.selectedSpeaker.subs = JSON.parse(event.target.result);
  //     dispatch(restoreFromJson(JSON.stringify(session)));
  //   }
  //
  //   const file = event.target.files[0];
  //   if (file) {
  //     const ext = getExt(file.name);
  //     if (ext !== 'json') {
  //       toast.warn('Invalid backup file format');
  //       return;
  //     }
  //     const reader = new FileReader();
  //     reader.onload = handleFileLoaded;
  //     reader.readAsText(file);
  //   }
  // };

  return (
    <Style className="tab-outlet">
      <div>
        <h3>{t('tabs.speakers.title')}</h3>
        <ListGroup className="app-list-group app-list-group-bottom">
          {speakers.map((speaker) => (
            <ListGroup.Item
              className={selectedSpeaker?.id && speaker.id === selectedSpeaker?.id ? 'selected' : ''}
              key={speaker.id}
              onClick={() => dispatch(selectSpeaker(speaker.id))}
            >
              <div className="color-preview" style={{backgroundColor: speaker.color || '#000'}}></div>
              <input
                className="list-item-input"
                type="text"
                value={speaker.displayName}
                onChange={(event) =>
                  dispatch(patchSpeaker(speaker.id, {displayName: event.target.value}))
                }
              />
              <span className="list-item--actions">
                                <button className="btn" onClick={() => dispatch(removeSpeaker(speaker))}>
                                    <FontAwesomeIcon icon={faTrashAlt}/>
                                </button>
                            </span>
            </ListGroup.Item>
          ))}
          {speakers.length < 10 && (
            <ListGroup.Item>
              <button className="btn add-button" onClick={() => dispatch(addSpeaker(createSpeaker()))}>
                <FontAwesomeIcon icon={faAdd}/>
              </button>
            </ListGroup.Item>
          )}
        </ListGroup>
      </div>
      {selectedSpeaker && (
        <Container className="speaker-form">
          <Row>
            <Col xs={12}>
              <h3>{selectedSpeaker.displayName}</h3>
            </Col>
          </Row>
          <Row>
            <Col className="label">{t('tabs.speakers.color')}</Col>
            <Col>
              <Form.Select
                className="app-select"
                value={selectedSpeaker.color}
                style={{backgroundColor: selectedSpeaker?.color || 'rgb(255 255 255 / 60%)'}}
                onChange={(event) =>
                  dispatch(patchSpeaker(selectedSpeaker.id, {color: event.target.value}))
                }
              >
                {colors.list.map(([name, value], index) => (
                  <option key={index} value={value}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col className="label">{t('tabs.speakers.speakerPreset')}</Col>
            <Col>
              <Form.Select
                className="app-select"
                value={selectedSpeaker.preset?.id}
                onChange={(event) => {
                  return dispatch(
                    patchSpeaker(selectedSpeaker.id, {
                      preset: presets.find((x) => x.id === +event.target.value),
                      subs: selectedSpeaker.subs.map((sub) => {
                        // Reset subs voicing
                        sub.data = null;
                        return sub;
                      }),
                    }),
                  );
                }}
              >
                {presets.map((preset, index) => (
                  <option key={index} value={preset.id}>
                    {preset.displayName}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          {/*<Row>*/}
          {/*  <Col className='label'>Import Subtitles</Col>*/}
          {/*  <Col className='file-wrapper'>*/}
          {/*    <Form.Control className='file'*/}
          {/*                  type='file'*/}
          {/*                  accept='.json'*/}
          {/*                  onChange={importSubs} />*/}
          {/*  </Col>*/}
          {/*</Row>*/}
        </Container>
      )}
    </Style>
  );
}
