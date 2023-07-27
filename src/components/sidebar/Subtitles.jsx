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
import { useSubsAudioStorage } from '../../hooks';
import { VoicedStatuses } from '../../models/Sub';
import { toast } from 'react-toastify';
import { VoicingService } from '../../models/enums';

const Style = styled.div`
  height: 100%;

  .ReactVirtualized__Table__row:nth-child(2n) {
    background-color: rgba(12, 12, 12, 0.5);
  }

  .ReactVirtualized__Table {
    height: 100%;

    .ReactVirtualized__Table__Grid {
      outline: none;
      height: 100%;
    }

    .ReactVirtualized__Grid__innerScrollContainer {
      padding-bottom: 40px;
    }

    .ReactVirtualized__Table__row {
      .item {
        height: 100%;
        padding: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        &.highlight {
          background-color: rgba(255, 255, 255, 0.08);

          textarea {
            border: 2px solid var(--c-speaker);
            //border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }

        &.illegal {
          textarea {
            background-color: var(--c-danger);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }

        .textarea {
          flex: 1;
          width: 100%;
          //height: 100%;
          color: #fff;
          font-size: 12px;
          padding: 10px;
          text-align: center;
          background-color: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
          resize: none;
          outline: none;
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
  const exportCodec = useSelector(store => store.settings.exportCodec);
  const { selectedSpeaker, selectedSub } = useSelector(store => store.session);
  const playingPlayer = useSelector(store => store.audio.players.find(x => x.playing));
  const [height, setHeight] = useState(100);
  const { saveSubAudio } = useSubsAudioStorage();
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
      const request = {
        service: selectedSpeaker.preset.service,
        locale: selectedSpeaker.preset.locale,
        voice: selectedSpeaker.preset.voice,
        text: sub.text,
        style: selectedSpeaker.preset.style,
        styleDegree: selectedSpeaker.preset.styleDegree,
        // role: 'string',
        pitch: selectedSpeaker.preset.pitch,
        volume: selectedSpeaker.preset.service === VoicingService.VoiceMaker ? 0 : 1,
        start: sub.startStr,
        end: sub.endStr,
        // format: exportCodec,
        outputFormat: 'wav',
        sampleRate: 'Rate48000',
        // speed: +speaker.speechConfig[7], // do not apply speed (rate)
      };
      console.log('Single speech request:', request);
      dispatch(patchSub(sub, {
        data: VoicedStatuses.processing,
      }));
      const audio = await speechApi.single(request, 'dev_placeholder');
      console.log('single audio url', audio);
      dispatch(addAudio(audio.url));
      sub.endTime = sub.start + audio.duration;
      await saveSubAudio(sub.id, audio.blob);
      dispatch(patchSub(sub, {
        end: sub.end,
        data: sub.buildVoicedStamp(audio.url, audio.baseDuration),
      }));
      toast.info('Subtitle voiced');
    }

    if (!sub.canBeVoiced) {
      toast.warn('Subtitle cannot be voiced, because you already voiced it');
      return;
    }
    if (!selectedSpeaker?.preset) return;
    if (sub.data?.src) {
      dispatch(removeAudio(sub.data?.src));
    }

    fetch().catch(err => {
      dispatch(patchSub(sub, {
        data: {},
      }));
      toast.error(`Voicing failed: ${err}`);
    });
  }, [dispatch, saveSubAudio, selectedSpeaker, exportCodec]);

  const playSub = useCallback((sub) => {
    if (playingPlayer) {
      dispatch(playAudio(sub.data.src, false));
      return;
    }
    if (sub.data?.src) {
      dispatch(playAudio(sub.data.src, true));
    } else {
      toast.warn('You must speak subtitle before download its');
    }
  }, [dispatch]);

  const downloadSub = useCallback((sub, index) => {
    if (sub.data?.src) {
      try {
        const start = sub.startStr.replaceAll(':', '-');
        const end = sub.endStr.replaceAll(':', '-');
        const fileName = `[${selectedSpeaker.displayName}-${index}] from ${start} to ${end}.wav`;
        download(sub.data.src, fileName);
        toast.info(`Subtitle downloaded '${fileName}'`);
      } catch (err) {
        toast.error(`Subtitle download failed: ${err}`);
      }
    } else {
      toast.warn('You must speak subtitle before download its');
    }
  }, [selectedSpeaker]);

  return (
    <Style>
      <Table
        headerHeight={40}
        width={600}
        containerStyle={{ marginBottom: '120px' }}
        height={height}
        rowHeight={80}
        scrollToIndex={selectedSpeaker?.subs.findIndex(x => x.id === selectedSub?.id) || 0}
        rowCount={selectedSpeaker?.subs.length || 0}
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
