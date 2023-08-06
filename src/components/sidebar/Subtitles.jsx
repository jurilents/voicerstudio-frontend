import styled from 'styled-components';
import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-virtualized';
import debounce from 'lodash/debounce';
import { download } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { playAudio } from '../../store/audioReducer';
import SubtitleItem from './SubtitleItem';
import { useSubsAudioStorage, useVoicer } from '../../hooks';
import { toast } from 'react-toastify';

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
        border: 1px solid transparent;

        &.highlight {
          background-color: rgba(255, 255, 255, 0.08);

          textarea {
            border: 2px solid var(--c-speaker);
            //border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }

        &.illegal {
          //background-color: var(--c-danger);
          border: 1px solid var(--c-danger);
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

        .item-info {
          width: 130px;
          font-size: 11px;

          .dimmed {
            color: var(--c-text);
            opacity: 80%;
          }
        }

        .item-bar {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          justify-content: space-evenly;
          margin-right: 4px;

          .item-bar-center-row {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;

            > * {
              text-align: center;

              &:first-child {
                width: 46%;
                max-width: 46%;
                text-align: right;
              }

              &:last-child {
                width: 46%;
                max-width: 46%;
                text-align: left;
              }
            }
          }

          .item-bar-row {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 7px;
            padding-left: 3px;
          }

          input {
            background-color: transparent;
            color: white;
            border: none;
            flex: 1;
            width: 90%;

            &.invalid {
              color: var(--c-danger);
            }
          }
        }

        .item-index {
          margin: 5px 3px 5px 0;
          padding-left: 3px;
          border-left: 2px solid #838383;
          border-radius: 1px;
          font-size: 10px;
          font-weight: bold;
        }

        .item-actions {
          font-size: 16px;
          padding-top: 8px;
          justify-content: center;

          button {
            background-color: transparent;
            border: none;
            min-height: 20px;
            opacity: 33%;
            cursor: pointer;

            &:not([disabled]):hover {
              opacity: 100%;
            }

            &[disabled] {
              cursor: not-allowed;
              opacity: 20%;
            }
          }

          .highlight {
            opacity: 80%;
          }
        }

        .item-icon {
          margin: 0 8px;
          opacity: 50%;
        }
      }
    }
  }
`;

export default function Subtitles({ player }) {
  const dispatch = useDispatch();
  const { selectedSpeaker, selectedSub, selectedCredentials } = useSelector(store => store.session);
  const playingPlayer = useSelector(store => store.audio.players.find(x => x.playing));
  const { speakSub } = useVoicer();
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
            <SubtitleItem key={props.key}
                          props={props}
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
