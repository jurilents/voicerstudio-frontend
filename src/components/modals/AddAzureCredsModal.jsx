import Modal from 'react-modal';
import { Col, Container, Form, Row } from 'react-bootstrap';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { VoicingService } from '../toolbar/tabs/PresetsTab.Editor';
import { credentialsApi } from '../../api/axios';
import { toast } from 'react-toastify';

const AddAzureCredsModal = ({ isOpen, setIsOpen }) => {
  const [voicingService, setVoicingService] = useState(VoicingService.Azure);
  const [azureSubscriptionKey, setAzureSubscriptionKey] = useState('');
  const [azureRegion, setAzureRegion] = useState('');
  const [checked, setChecked] = useState(false);
  const [encryptedCreds, setEncryptedCreds] = useState('');

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCredChange = () => {
    setChecked(false);
    setEncryptedCreds('');
  };

  const getVoicingServiceCreds = () => {
    switch (voicingService) {
      case VoicingService.Azure:
        return {
          subscriptionKey: azureSubscriptionKey,
          region: azureRegion,
        };
      case VoicingService.VoiceMaker:
        return {
          apiKey: '',
        };
      default:
        console.error(`Invalid voicing service provided: ${voicingService}`);
        return {};
    }
  };

  const submit = async () => {
    if (checked) {
      return;
    }

    const creds = getVoicingServiceCreds();
    console.log('creds', creds);

    try {
      const securedCreds = await credentialsApi.secureCredentials(voicingService, creds);
      console.log('securedCreds', securedCreds);
      setChecked(true);
      toast.success('Great! Credentials are valid!');
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      style={{
        content: {
          inset: 'unset',
        },
      }}
      onRequestClose={closeModal}
      contentLabel='Example Modal'>
      <button className='btn-app-close' onClick={closeModal}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <h2 className='my-4'>Add Credentials</h2>

      <Container className='modal-container'>
        <Row className='mb-3'>
          <Col className='label'>Service</Col>
          <Col className='range-wrapper'>
            <Form.Select className='app-select'
                         onChange={(event) => setVoicingService(event.target.value)}
                         value={voicingService}>
              {Object.entries(VoicingService).map(([key, val], index) => (
                <option key={index} value={key}>{val}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {voicingService === VoicingService.Azure && (
          <>
            <Row className='mb-3'>
              <Col className='label'>Subscription Key</Col>
              <Col className='range-wrapper'>
                <Form.Control type='password'
                              className='app-input'
                              placeholder='Subscription Key'
                              onChange={(event) => {
                                setAzureSubscriptionKey(event.target.value);
                                handleCredChange();
                              }} />
              </Col>
            </Row>
            <Row className='mb-4'>
              <Col className='label'>Region</Col>
              <Col className='range-wrapper'>
                <Form.Control type='password'
                              className='app-input'
                              placeholder='Region'
                              onChange={(event) => {
                                setAzureRegion(event.target.value);
                                handleCredChange();
                              }} />
              </Col>
            </Row>
          </>
        )}
        {voicingService === VoicingService.VoiceMaker && (
          <>
            <Row className='mb-3'>
              <Col className='label'>API Key</Col>
              <Col className='range-wrapper'>
                <Form.Control type='password'
                              className='app-input'
                              placeholder='API Key'
                              onChange={(event) => {
                                setAzureSubscriptionKey(event.target.value);
                                handleCredChange();
                              }} />
              </Col>
            </Row>
          </>
        )}
        <Row>
          <Col>
            <button className='btn btn-modal btn-outline'
                    onClick={submit}
                    disabled={voicingService !== VoicingService.Azure}>
              {checked ? 'Add' : 'Check'}
            </button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
};

export default AddAzureCredsModal;
