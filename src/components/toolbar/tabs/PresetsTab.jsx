import React, { memo } from 'react';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { patchCreds, patchPreset, removeCreds, removePreset } from '../../../store/sessionReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AddCredsModal from '../../modals/AddCredsModal';
import AddPresetModal from '../../modals/AddPresetModal';

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
`;

const PresetsTab = () => {
  const { credentials, presets } = useSelector(store => store.session);
  const [credsModalIsOpen, toggleCredsModal] = React.useState(false);
  const [presetModalIsOpen, togglePresetModal] = React.useState(false);

  const dispatch = useDispatch();

  return (
    <Style className='tab-outlet'>
      <div className='mb-5'>
        <h3>Credentials</h3>
        <ListGroup className='presets-list app-list-group'>
          {credentials.map((cred) => (
            <ListGroup.Item key={cred.value}>
              <img className='service-logo'
                   src={`/images/${cred.service}-logo.png`}
                   alt={cred.service}
                   title={cred.service} />
              <input className='list-item-text'
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
          <ListGroup.Item>
            <button className='btn add-button'
                    onClick={() => toggleCredsModal(true)}>
              <FontAwesomeIcon icon={faAdd} />
            </button>
          </ListGroup.Item>
        </ListGroup>
      </div>


      <div className='mb-3'>
        <h3>Presets</h3>
        <ListGroup className='presets-list app-list-group'>
          {presets.map((preset) => (
            <ListGroup.Item key={preset.id}>
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
          <ListGroup.Item>
            <button className='btn add-button'
                    onClick={() => togglePresetModal(true)}>
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
