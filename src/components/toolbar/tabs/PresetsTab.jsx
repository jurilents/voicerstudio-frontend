import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { patchCreds, patchPreset, removeCreds, removePreset, selectCreds } from '../../../store/sessionReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AddCredsModal from '../../modals/AddCredsModal';
import AddPresetModal from '../../modals/AddPresetModal';
import { VoicingService } from '../../../models/enums';
import { toast } from 'react-toastify';

const Style = styled.div`
  .presets-list {
    max-height: 250px;
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

  .preset-selected {
    border: 2px solid var(--c-primary) !important;
  }
`;

const PresetsTab = () => {
  const dispatch = useDispatch();
  const { credentials, selectedCredentials, presets } = useSelector(store => store.session);
  const [credsModalIsOpen, toggleCredsModal] = React.useState(false);
  const [presetModalIsOpen, togglePresetModal] = React.useState(false);
  const azureCreds = useMemo(() => credentials.filter(x => x.service === VoicingService.Azure), [credentials]);

  const isCredSelected = (cred) => {
    return selectedCredentials.Azure && cred.value === selectedCredentials.Azure.value;
  };

  const showAddPresetModal = () => {
    if (credentials?.length) {
      togglePresetModal(true);
    } else {
      toast.info('Add credentials before adding preset');
    }
  };

  return (
    <Style className='tab-outlet'>
      <div className='mb-5'>
        <h3>Voicing Bots</h3>
        <Container>
          <Row>
            {azureCreds.length > 0 ? (
              <>
                <Col className='label'>Default Azure credentials</Col>
                <Col>
                  <Form.Select className='app-select'
                               value={selectedCredentials.Azure?.value || ''}
                               onChange={(event) => {
                                 const cred = credentials.find(x => x.value === event.target.value);
                                 dispatch(selectCreds(cred, VoicingService.Azure));
                               }}>
                    {azureCreds.map((cred, index) => (
                      <option key={index} value={cred.value}>
                        {cred.displayName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </>
            ) : (
              <Col xs={12} className='text-center mb-2'>
                Press '+' and add your Azure credentials
              </Col>
            )}
          </Row>
        </Container>
        <ListGroup className='presets-list app-list-group'>
          {credentials.map((cred) => (
            <ListGroup.Item key={cred.value} className={isCredSelected(cred) ? 'preset-selected' : ''}>
              <img className='service-logo'
                   src={`/images/${cred.service}-logo.png`}
                   alt={cred.service}
                   title={cred.service} />
              <input className='list-item-input'
                     type='text'
                     value={cred.displayName}
                     onChange={(event) =>
                       dispatch(patchCreds(cred, { displayName: event.target.value }))} />
              <span className='list-item-actions'>
                <button className='btn'
                        onClick={() => dispatch(removeCreds(cred))}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <ListGroup className='presets-list app-list-group'>
          <ListGroup.Item>
            <button className='btn add-button'
                    onClick={() => toggleCredsModal(true)}>
              <FontAwesomeIcon icon={faAdd} />
            </button>
          </ListGroup.Item>
        </ListGroup>
      </div>

      <div>
        <h3>Presets</h3>
        <ListGroup className='presets-list app-list-group'>
          {presets.map((preset) => (
            <ListGroup.Item key={preset.id}>
              <img className='service-logo'
                   src={`/images/${preset.service}-logo.png`}
                   alt={preset.service}
                   title={preset.service} />
              <input className='list-item-input'
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
        <ListGroup className='presets-list app-list-group'>
          <ListGroup.Item>
            <button className='btn add-button'
                    onClick={showAddPresetModal}>
              <FontAwesomeIcon icon={faAdd} />
            </button>
          </ListGroup.Item>
        </ListGroup>
      </div>
      <AddCredsModal isOpen={credsModalIsOpen} setIsOpen={toggleCredsModal} />
      <AddPresetModal isOpen={presetModalIsOpen} setIsOpen={togglePresetModal} />
    </Style>
  );
};

export default memo(
  PresetsTab,
  (prevProps, nextProps) => true,
);
