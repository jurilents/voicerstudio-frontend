import React from 'react';
import styled from 'styled-components';
import {Col, Container, Form, ListGroup, Row} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from 'react-redux';
import {patchMarker, selectMarker, setMarker} from '../../../store/sessionReducer';
import colors from '../../../utils/colors';
import {formatTime} from '../../../utils';
import {useMarkers} from '../../../hooks';
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
`;

const MarkersTab = () => {
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player.videoPlayer);
  const {markers, selectedMarker} = useSelector((store) => store.session);
  const {goToMarker} = useMarkers(player);
  const {t} = useTranslation();

  return (
    <Style className="tab-outlet">
      <div>
        <h3>{t('tabs.markers.title')}</h3>
        <p className="text-center mb-3">{t('tabs.markers.description')}</p>
        <ListGroup className="app-list-group app-list-group-bottom">
          {markers?.map((marker) => (
            <ListGroup.Item
              className={selectedMarker?.id && marker.id === selectedMarker?.id ? 'selected' : ''}
              key={marker.id}
              onClick={() => {
                dispatch(selectMarker(marker));
                goToMarker(marker);
              }}>
              <div className="color-preview" style={{backgroundColor: marker.color || '#000'}}></div>
              <input
                className="list-item-input"
                type="text"
                value={marker.text}
                onChange={(event) => dispatch(patchMarker(marker, {text: event.target.value}))}
              />
              <div className="list-item-text">{formatTime(marker.time, true)}</div>
              <span className="list-item--actions">
                                <button className="btn" onClick={() => dispatch(setMarker(marker))}>
                                    <FontAwesomeIcon icon={faTrashAlt}/>
                                </button>
                            </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      {selectedMarker && (
        <Container className="speaker-form">
          <Row>
            <Col className="label">{t('tabs.markers.color')}</Col>
            <Col>
              <Form.Select
                className="app-select"
                value={selectedMarker.color}
                style={{backgroundColor: selectedMarker?.color || 'rgb(255 255 255 / 60%)'}}
                onChange={(event) =>
                  dispatch(patchMarker(selectedMarker, {color: event.target.value}))
                }>
                {colors.list.map(([name, value], index) => (
                  <option key={index} value={value}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Container>
      )}
    </Style>
  );
};

export default MarkersTab;
