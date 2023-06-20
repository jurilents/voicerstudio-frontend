import styled from 'styled-components';
import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-virtualized';
import debounce from 'lodash/debounce';
import { download } from '../../utils';
import { speechApi } from '../../api/axios';
import { useDispatch } from 'react-redux';
import { addAudio, playAudio, removeAudio } from '../../store/audioReducer';
import SubtitleItem from './SubtitleItem';

const Style = styled.div`
  .ReactVirtualized__Table__row:nth-child(2n) {
    background-color: rgba(12, 12, 12, 0.5);
  }

  .ReactVirtualized__Table {
    height: 100%;

    .ReactVirtualized__Table__Grid {
      outline: none;
      height: 100%;
    }

    .ReactVirtualized__Table__row {
      .item {
        height: 100%;
        padding: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        .textarea {
          flex: 1;
          width: 100%;
          //height: 100%;
          color: #fff;
          font-size: 12px;
          padding: 10px;
          text-align: center;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
          resize: none;
          outline: none;

          &.highlight {
            background-color: rgb(0 87 158);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          &.illegal {
            background-color: rgb(123 29 0);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }

        .item-bar {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          justify-content: space-evenly;

          input {
            background-color: transparent;
            color: white;
            border: none;
            width: 90%;
          }
        }

        .item-index {
          margin: 5px 3px 5px 0;
          padding-right: 3px;
          border-right: 1px solid #838383;
          font-size: 10px;
        }

        .item-timing {
          width: 80px;
          font-size: 11px;

          .estimate-duration {
            color: #02b2a2;
          }

          .timing-duration {
            opacity: 40%;
          }
        }

        .item-actions {
          width: 30px;
          font-size: 16px;
          padding-left: 5px;

          button {
            background-color: transparent;
            border: none;
            width: 100%;
            min-height: 20px;
            opacity: 75%;
            cursor: pointer;

            &:hover {
              opacity: 100%;
            }
          }
        }
      }
    }
  }
`;

export default function Subtitles(
  {
    subtitle,
    speakers,
    checkSub,
    player,
    updateSub,
    settings,
  }) {
  const dispatch = useDispatch();
  const [height, setHeight] = useState(100);
  const resize = useCallback(() => {
    setHeight(document.body.clientHeight - 335);
  }, [setHeight]);

  useEffect(() => {
    resize();
    if (!resize.init) {
      resize.init = true;
      const debounceResize = debounce(resize, 600);
      window.addEventListener('resize', debounceResize);
    }
  }, [resize]);

  const currentSpeakerSubs = subtitle.filter(x => x.speaker === settings.currentSpeaker);
  const currentSpeaker = speakers.find(x => x.id === settings.currentSpeaker);

  const speakSub = useCallback((sub) => {
    async function fetch() {
      const speaker = speakers.find(x => x.id === settings.currentSpeaker);
      const request = {
        locale: speaker.locale,
        voice: speaker.voice,
        text: sub.text,
        style: speaker.speechConfig[3],
        styleDegree: +speaker.speechConfig[4],
        // role: 'string',
        pitch: +speaker.speechConfig[5],
        volume: +speaker.speechConfig[6],
        start: sub.start,
        end: sub.end,
        // speed: +speaker.speechConfig[7], // do not apply speed (rate)
      };
      console.log('Single speech request:', request);
      const audio = await speechApi.single(request, 'test');
      console.log('single audio url', audio);
      dispatch(addAudio(audio.url));
      sub.endTime = sub.startTime + audio.duration;
      updateSub(sub, {
        end: sub.end,
        voicedStamp: sub.buildVoicedStamp(audio.url),
      });
    }

    if (sub.voicedStamp?.audioUrl) {
      dispatch(removeAudio(sub.voicedStamp.audioUrl));
    }
    fetch();
  }, [dispatch, updateSub, speakers, settings.currentSpeaker]);

  const playSub = useCallback((sub) => {
    if (sub.voicedStamp?.audioUrl) {
      dispatch(playAudio(sub.voicedStamp.audioUrl, true));
    }
  }, [dispatch]);

  const downloadSub = useCallback((sub, index) => {
    if (sub.voicedStamp?.audioUrl) {
      const start = sub.start.replaceAll(':', '-');
      const end = sub.end.replaceAll(':', '-');
      const fileName = `[${currentSpeaker.name}-${index}] ${start} to ${end}.wav`;
      download(sub.voicedStamp.audioUrl, fileName);
    }
  }, [currentSpeaker.name]);

  return (
    <Style>
      <Table
        headerHeight={40}
        width={600}
        height={height}
        rowHeight={80}
        scrollToIndex={currentSpeakerSubs.findIndex(x => x.id === settings.currentSubtitle)}
        rowCount={currentSpeakerSubs.length}
        rowGetter={({ index }) => currentSpeakerSubs[index]}
        headerRowRenderer={() => null}
        rowRenderer={(props) => {
          return (
            <SubtitleItem
              key={props.key}
              currentSpeaker={currentSpeaker}
              checkSub={checkSub}
              player={player}
              settings={settings}
              props={props}
              updateSub={updateSub}
              speakSub={speakSub}
              downloadSub={downloadSub}
              playSub={playSub} />
          );
        }}
      ></Table>
    </Style>
  );
}
