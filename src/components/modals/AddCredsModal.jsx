import Modal from 'react-modal';
import {Col, Container, Form, Row} from 'react-bootstrap';
import React, {memo, useCallback, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {credentialsApi} from '../../api/axios';
import {toast} from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import {addCreds} from '../../store/sessionReducer';
import {Creds} from '../../models';
import {Status} from '../../api/constants';
import {VoicingService} from '../../models/enums';

const AddCredsModal = ({isOpen, setIsOpen}) => {
  const dispatch = useDispatch();
  const credentials = useSelector((store) => store.session.credentials);
  const [voicingService, setVoicingService] = useState(VoicingService.AuthorizerBot.key);
  const [status, setStatus] = useState(Status.none);
  const [securedCreds, setSecuredCreds] = useState('');
  const [creds, setCreds] = useState({});

  const patchCreds = useCallback((patch) => {
    setCreds((prev) => ({...prev, ...patch}));
  }, [setCreds]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCredChange = () => {
    setStatus(Status.none);
    setSecuredCreds('');
  };

  const getVoicingServiceCreds = () => {
    switch (voicingService) {
      case VoicingService.AuthorizerBot.key:
        return {
          userToken: creds.userToken,
        };
      case VoicingService.Azure.key:
        return {
          subscriptionKey: creds.subscriptionKey,
          region: creds.region,
        };
      // case VoicingService.VoiceMaker:
      //   return {
      //     apiKey: '',
      //   };
      default:
        console.error(`Invalid voicing service provided: ${voicingService}`);
        return {};
    }
  };

  const submitCheck = async () => {
    if (status === Status.loading) {
      toast.info('Wait. We are checking your credentials...');
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

  const submitAdd = async () => {
    if (status === Status.loading) {
      toast.info('Wait. We are checking your credentials...');
      return;
    }
    if (status === Status.success) {
      dispatch(
        addCreds(
          new Creds({
            service: voicingService,
            value: securedCreds,
            displayName: `${voicingService} ${credentials.length + 1}`,
          }),
        ),
      );
      setIsOpen(false);
      handleCredChange();
      patchCreds({
        subscriptionKey: '',
        region: '',
      });
      toast.success('Credentials added!');
    } else {
      toast.info('Check credentials before add');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      style={{content: {inset: 'unset'}}}
      onRequestClose={closeModal}
      contentLabel="Add Credentials">
      <button className="btn-app-close" onClick={closeModal}>
        <FontAwesomeIcon icon={faXmark}/>
      </button>
      <h2 className="my-4">Add Credentials</h2>

      <Container className="modal-container">
        <Row className="mb-3">
          <Col className="label">Service</Col>
          <Col className="range-wrapper">
            <Form.Select
              className="app-select"
              onChange={(event) => {
                setCreds({});
                console.log('creds:', event.target.value);
                setVoicingService(event.target.value);
              }}
              value={voicingService}>
              {Object.entries(VoicingService).map(([_, {key, name}], index) => (
                <option key={index} value={key}>
                  {name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {voicingService === VoicingService.AuthorizerBot.key && (
          <>
            <Row className="mb-3">
              <Col className="label">Authorization Key</Col>
              <Col className="range-wrapper">
                <Form.Control
                  type="password"
                  className="app-input"
                  placeholder="YOURKEY123"
                  onChange={(event) => {
                    patchCreds({userToken: event.target.value});
                    handleCredChange();
                  }}/>
              </Col>
            </Row>
          </>
        )}
        {voicingService === VoicingService.Azure.key && (
          <>
            <Row className="mb-3">
              <Col className="label">Subscription Key</Col>
              <Col className="range-wrapper">
                <Form.Control
                  type="password"
                  className="app-input"
                  placeholder="a1b2cca1b2c3..."
                  onChange={(event) => {
                    patchCreds({subscriptionKey: event.target.value});
                    handleCredChange();
                  }}/>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col className="label">Region</Col>
              <Col className="range-wrapper">
                <Form.Control
                  // type="password"
                  className="app-input"
                  placeholder="eastus"
                  onChange={(event) => {
                    patchCreds({region: event.target.value});
                    handleCredChange();
                  }}/>
              </Col>
            </Row>
          </>
        )}
        {/*{voicingService === VoicingService.VoiceMaker && (*/}
        {/*  <>*/}
        {/*    <Row className="mb-3">*/}
        {/*      <Col className="label">API Key</Col>*/}
        {/*      <Col className="range-wrapper">*/}
        {/*        <Form.Control*/}
        {/*          type="password"*/}
        {/*          className="app-input"*/}
        {/*          placeholder="API Key"*/}
        {/*          onChange={(event) => {*/}
        {/*            setAzureSubscriptionKey(event.target.value);*/}
        {/*            handleCredChange();*/}
        {/*          }}/>*/}
        {/*      </Col>*/}
        {/*    </Row>*/}
        {/*  </>*/}
        {/*)}*/}
        <Row>
          <Col>
            <button
              className="btn btn-modal btn-primary btn-outline-disabled"
              onClick={submitCheck}
              disabled={status === Status.success}>
              {status === Status.loading ? 'Checking...' : 'Check'}
            </button>
          </Col>
          <Col>
            <button
              className="btn btn-modal btn-primary btn-outline-disabled"
              onClick={submitAdd}
              disabled={status !== Status.success}>
              Add
            </button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
};

export default memo(AddCredsModal, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen && prevProps.setIsOpen === nextProps.setIsOpen;
});
