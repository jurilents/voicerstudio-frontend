import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {ListGroup} from 'react-bootstrap';
import timelineStyles from '../timelineStyles';
import {useDispatch, useSelector} from 'react-redux';
import {selectSpeaker} from '../../../store/sessionReducer';
import {useAudioControls} from '../../../hooks';
import {borderRadius} from '../../../styles/constants';
import {useTranslation} from 'react-i18next';

const Style = styled.div`
  width: ${timelineStyles.headingWidth + 10};
  min-width: 210px;
    //max-width: ${timelineStyles.headingWidth + 10};
  height: 100%;
  padding: 42px 0 5px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: hidden;

  .inner {
    position: relative;
    height: 100%;
    background-color: #f00;
    transition: all 0.3s ease 0s;

    span {
      position: absolute;
      top: 3px;
      right: 0;
      padding: 2px 5px;
      color: #fff;
      font-size: 12px;
      background-color: rgb(0 0 0 / 80%);
    }
  }

  .app-list-group {
    flex-direction: column;
    //overflow-y: scroll;
    width: 200px;
    overflow-y: scroll;
  }

  .list-group-item {
    //height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px !important;
    border: 1px solid transparent;
    border-right: 3px solid transparent;
    cursor: pointer;

    &:focus-within {
      background-color: inherit;
    }

    &.selected-speaker {
      background-color: rgb(255 255 255 / 10%);
      border-right-width: 10px;
    }
  }

  .speaker-actions {
    display: flex;
    flex-wrap: nowrap;
    gap: 5px;
  }

  .speaker-btn {
    background-color: rgb(255 255 255 / 10%);
    border-radius: ${borderRadius};
    aspect-ratio: 1;
    height: 28px;

    &:hover {
      background-color: var(--c-primary-dark);
    }

    &.mute-active {
      background-color: var(--c-warn);
    }

    &.solo-active {
      background-color: var(--c-danger);
    }
  }

  .speaker-name {
    text-overflow: ellipsis;
    max-height: 40px;
    overflow: hidden;
    padding: 0 8px;
  }
`;

export const TimelineHeading = ({innerRef}) => {
  const dispatch = useDispatch();
  const settings = useSelector((store) => store.settings);
  const {speakers, selectedSpeaker} = useSelector((store) => store.session);
  const timelineRowHeight = useSelector((store) => store.settings.timelineRowHeight);
  const [state, setState] = useState(false);
  const audioControls = useAudioControls();
  const {t} = useTranslation();

  useEffect(() => {
    function handleScroll(e) {
      console.log('scrolling', e);
      if (window.timelineEngine) {
        window.timelineEngine.setScrollTop(+e.target.scrollTop);
      }
    }

    const elm = innerRef.current;
    if (elm) {
      elm.addEventListener('scroll', handleScroll);
    }

    return () => {
      elm.removeEventListener('scroll', handleScroll);
    };
  }, [innerRef]);

  return (
    <Style className="timeline-heading">
      <ListGroup ref={innerRef} className="app-list-group">
        <ListGroup.Item
          style={{
            borderColor: '#5e5e5e',
            height: timelineRowHeight * 2,
            minHeight: timelineRowHeight * 2,
          }}
        >
          <div className="speaker-actions">
            <button
              className={'btn speaker-btn' + (settings.originalMute ? ' mute-active' : '')}
              title="Mute"
              onClick={audioControls.toggleOriginalMute}>
              M
            </button>
            {/*<button className={'btn speaker-btn' + (settings.originalSolo ? ' solo-active' : '')}*/}
            {/*        title='Solo'*/}
            {/*        onClick={audioControls.toggleOriginalSolo}>*/}
            {/*  S*/}
            {/*</button>*/}
          </div>
          <div className="speaker-name">{t('timeline.originalAudio')}</div>
        </ListGroup.Item>
        {speakers.map((speaker, index) => (
          <ListGroup.Item
            key={index}
            className={selectedSpeaker.id === speaker.id ? 'selected-speaker' : ''}
            style={{borderColor: speaker.color, height: timelineRowHeight}}
            onClick={() => dispatch(selectSpeaker(speaker.id))}>
            <div className="speaker-actions">
              <button
                className={'btn speaker-btn' + (speaker.mute ? ' mute-active' : '')}
                title="Mute"
                onClick={() => {
                  audioControls.toggleSpeakerMute(speaker);
                  setState(!state);
                }}>
                M
              </button>
              {/*<button className={'btn speaker-btn' + (speaker.solo ? ' solo-active' : '')}*/}
              {/*        title='Solo'*/}
              {/*        onClick={() => audioControls.toggleSpeakerSolo(speaker)}>*/}
              {/*  S*/}
              {/*</button>*/}
            </div>
            <div className="speaker-name">{speaker.displayName}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Style>
  );
};
