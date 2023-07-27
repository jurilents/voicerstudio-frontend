import Modal from 'react-modal';
import { Col, Container, Form, Row } from 'react-bootstrap';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { credentialsApi } from '../../api/axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addCreds } from '../../store/sessionReducer';
import { Creds } from '../../models';
import { Status } from '../../api/constants';
import { VoicingService } from '../../models/enums';

const AddCredsModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const credentials = useSelector(store => store.session.credentials);
  console.log('credentials', credentials);
  const [voicingService, setVoicingService] = useState(VoicingService.Azure);
  const [status, setStatus] = useState(Status.none);
  const [securedCreds, setSecuredCreds] = useState('');
  const [azureSubscriptionKey, setAzureSubscriptionKey] = useState('');
  const [azureRegion, setAzureRegion] = useState('');

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCredChange = () => {
    setStatus(Status.none);
    setSecuredCreds('');
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
    if (status === Status.loading) {
      toast.info('Wait. We are checking your credentials...');
      return;
    }
    if (status === Status.success) {
      dispatch(addCreds(new Creds({
        service: voicingService,
        value: securedCreds,
        displayName: `${voicingService} ${credentials.length + 1}`,
      })));
      setIsOpen(false);
      handleCredChange();
      setAzureSubscriptionKey('');
      setAzureRegion('');
      toast.success('Credentials added!');
      return;
    }

    setStatus(Status.loading);
    const creds = getVoicingServiceCreds();
    console.log('creds', creds);

    try {
      const securedCreds = await credentialsApi.secureCredentials(voicingService, creds);

      setSecuredCreds(securedCreds.credentials);
      setStatus(Status.success);
      toast.success('Great! Credentials are valid');
    } catch (err) {
      console.log(err);
      setStatus(Status.failure);
      toast.error(err.response?.data.message || 'Unknown error :(');
    }
  };

  return (
    <Modal isOpen={isOpen}
           ariaHideApp={false}
           style={{
             content: {
               inset: 'unset',
             },
           }}
           onRequestClose={closeModal}
           contentLabel='Add Credentials'>
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
                              placeholder='a1b2cca1b2c3...'
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
                              placeholder='eastus'
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
              {status === Status.success
                ? 'Add' : status === Status.loading
                  ? 'Checking...' : 'Check'}
            </button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
};

export default AddCredsModal;
