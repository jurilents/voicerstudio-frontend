import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-virtualized';
import debounce from 'lodash/debounce';
import { download } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { playAudio } from '../../store/audioReducer';
import SubtitleItem from './SubtitleItem';
import { useSubsAudioStorage, useVoicer } from '../../hooks';
import { toast } from 'react-toastify';
import { Style } from './Subtitles.styles';

export default function Subtitles({ player }) {
  const dispatch = useDispatch();
  const { showNote } = useSelector(store => store.settings);
  const { selectedSpeaker, selectedSub, selectedCredentials } = useSelector(store => store.session);
  const playingPlayer = useSelector(store => store.audio.players.find(x => x.playing));
  const { speakSub } = useVoicer();
  const [height, setHeight] = useState(100);
  const { saveSubAudio } = useSubsAudioStorage();
  const resize = useCallback(() => {
    setHeight(document.body.clientHeight - 378);
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
      <Table headerHeight={40}
             width={600}
             containerStyle={{ marginBottom: '120px' }}
             height={height}
             rowHeight={80}
             scrollToIndex={selectedSpeaker?.subs.findIndex(x => x.id === selectedSub?.id) || 0}
             rowCount={selectedSpeaker?.subs.length || 0}
             rowGetter={({ index }) => selectedSpeaker.subs[index]}
             rowStyle={({ index }) => (index % 2 === 1 && { backgroundColor: 'rgba(12, 12, 12, 0.6)' })}
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
                               playSub={playSub}
                               showNote={showNote} />
               );
             }}
      ></Table>
    </Style>
  );
}
