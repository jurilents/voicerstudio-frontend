import styled from 'styled-components';
import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-virtualized';
import debounce from 'lodash/debounce';
import { download } from '../../utils';
import { speechApi } from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { addAudio, playAudio, removeAudio } from '../../store/audioReducer';
import SubtitleItem from './SubtitleItem';
import { patchSub } from '../../store/sessionReducer';

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
            background-color: var(--c-primary-dark);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          &.illegal {
            background-color: var(--c-danger);
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
          border-right: 2px solid #838383;
          border-radius: 1px;
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

export default function Subtitles({ player }) {
  const dispatch = useDispatch();
  const { selectedSpeaker, selectedSub } = useSelector(store => store.session);
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

  const speakSub = useCallback((sub) => {
    async function fetch() {
      const speaker = selectedSpeaker;
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
      dispatch(patchSub(sub, {
        end: sub.end,
        voicedStamp: sub.buildVoicedStamp(audio.url),
      }));
    }

    if (sub.voicedStamp?.audioUrl) {
      dispatch(removeAudio(sub.voicedStamp.audioUrl));
    }
    fetch();
  }, [dispatch, selectedSpeaker]);

  const playSub = useCallback((sub) => {
    if (sub.voicedStamp?.audioUrl) {
      dispatch(playAudio(sub.voicedStamp.audioUrl, true));
    }
  }, [dispatch]);

  const downloadSub = useCallback((sub, index) => {
    if (sub.voicedStamp?.audioUrl) {
      const start = sub.start.replaceAll(':', '-');
      const end = sub.end.replaceAll(':', '-');
      const fileName = `[${selectedSpeaker.displayName}-${index}] ${start} to ${end}.wav`;
      download(sub.voicedStamp.audioUrl, fileName);
    }
  }, [selectedSpeaker]);

  return (
    <Style>
      <Table
        headerHeight={40}
        width={600}
        height={height}
        rowHeight={80}
        scrollToIndex={selectedSpeaker.subs.findIndex(x => x.id === selectedSub?.id) || 0}
        rowCount={selectedSpeaker.subs.length}
        rowGetter={({ index }) => selectedSpeaker.subs[index]}
        headerRowRenderer={() => null}
        rowRenderer={(props) => {
          return (
            <SubtitleItem
              key={props.key}
              props={props}
              color={selectedSpeaker.color}
              sub={props.rowData}
              selectedSub={selectedSub}
              selectedSpeaker={selectedSpeaker}
              player={player}
              speakSub={speakSub}
              downloadSub={downloadSub}
              playSub={playSub} />
          );
        }}
      ></Table>
    </Style>
  );
}
