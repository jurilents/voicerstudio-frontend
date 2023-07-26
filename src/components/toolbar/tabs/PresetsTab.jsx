import React, { memo, useState } from 'react';
import styled from 'styled-components';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { patchPreset, removePreset } from '../../../store/sessionReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PresetEditor, { VoicingService } from './PresetsTab.Editor';
import AddAzureCredsModal from '../../modals/AddAzureCredsModal';

const Style = styled.div`
  .presets-list {
    max-height: 200px;
    overflow-y: scroll;
  }

  .service-logo {
    display: block;
    height: 20px;
    margin: auto 5px;
  }

  .offset {
    height: 30px;
  }

  .text-to-voice {
    width: 100%;
    background-color: transparent;
    color: white;
    padding: 10px;
    min-height: 60px;
    max-height: 200px;
  }

  .audio {
    min-width: 100%;
    height: 40px !important;
    margin: 10px 0 5px 0;
  }
`;

const PresetsTab = () => {
  const presets = useSelector(store => store.session.presets);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [selectedService, setSelectedService] = useState(VoicingService.Azure);
  const [extraAccuracy, setExtraAccuracy] = useState(false);
  const dispatch = useDispatch();
  let maxPresetId = useSelector(store => store.session.presets.length
    ? Math.max.apply(null, (store.session.presets).map(x => x.id)) : 0);

  return (
    <Style className='tab-outlet'>
      <div className='mb-5'>
        <h3>Presets</h3>
        <ListGroup className='presets-list app-list-group'>
          {presets.map((preset) => (
            <ListGroup.Item
              key={preset.id}>
              <img className='service-logo'
                   src={`/images/${preset.service}-logo.png`}
                   alt={preset.service}
                   title={preset.service} />
              <input className='list-item-text'
                     type='text'
                     value={preset.displayName}
                     onChange={(event) =>
                       dispatch(patchPreset(preset.id, { displayName: event.target.value }))} />
              <span className='list-item-actions'>
                <button
                  className='btn'
                  onClick={() => dispatch(removePreset(preset.id))}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <Container className='mb-3'>
        {/* ************ Voicing Service ************ */}
        <Row>
          <Col>
            Voicing service
          </Col>
          <Col className='mb-3'>
            <Form.Select className='app-select'
                         onChange={(event) => setSelectedService(event.target.value)}>
              {Object.entries(VoicingService).map(([key, val], index) => (
                <option key={index} value={val}>{key}</option>
              ))}
            </Form.Select>
          </Col>
          <Col className='mb-1'>
            <button
              className='btn btn-modal btn-outline'
              onClick={() => setIsOpen(true)}>
              Add Credentials
            </button>
          </Col>
        </Row>
        {/* ************ Extra Accuracy ************ */}
        <Row>
          <Col className='label'>Extra Accuracy Inputs</Col>
          <Col>
            <Form.Check
              checked={extraAccuracy}
              onChange={(event) => setExtraAccuracy(event.target.checked)} />
          </Col>
        </Row>
      </Container>
      <PresetEditor
        selectedService={selectedService}
        maxPresetId={maxPresetId}
        extraAccuracy={extraAccuracy} />
      <AddAzureCredsModal isOpen={modalIsOpen} setIsOpen={setIsOpen} />
    </Style>
  );
};

export default memo(
  PresetsTab,
  (prevProps, nextProps) => true,
);
