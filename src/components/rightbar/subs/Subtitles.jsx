import React, {useCallback} from 'react';
import {Table} from 'react-virtualized';
import {download} from '../../../utils';
import {useSelector} from 'react-redux';
import SubtitleItem from './SubtitleItem';
import {useTranslator, useVoicer} from '../../../hooks';
import {toast} from 'react-toastify';
import {Style} from './Subtitles.styles';
import {Sub} from '../../../models';
import {useTranslation} from 'react-i18next';


const demoSub = new Sub({
  id: '_tutor',
  start: 0,
  end: 3.14,
  text: 'Hi! I am a demo subtitle. I will be deleted when the tutorial is over 👋',
  data: {text: '', src: 'https://voicerstudio.com/fake.wav'},
});


export default function Subtitles({width, height, tutorialEnabled}) {
  const {t} = useTranslation();
  const player = useSelector((store) => store.player.videoPlayer);
  const {showNote, autoTranslateSub} = useSelector((store) => store.settings);
  const {selectedSpeaker, selectedSub} = useSelector((store) => store.session);
  const {speakSub} = useVoicer();
  const {translateSub} = useTranslator();

  const downloadSub = useCallback(
    (sub, index) => {
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
    },
    [selectedSpeaker],
  );

  return (
    <Style>
      <Table
        headerHeight={40}
        width={width}
        containerStyle={{marginBottom: '180px'}}
        height={height}
        rowHeight={80}
        scrollToIndex={tutorialEnabled
          ? 0
          : (selectedSpeaker?.subs.findIndex((x) => x.id === selectedSub?.id) || 0)}
        rowCount={tutorialEnabled ? 1 : (selectedSpeaker?.subs.length || 0)}
        rowGetter={({index}) => {
          if (tutorialEnabled) {
            return demoSub;
          }
          return selectedSpeaker.subs[index];
        }}
        rowStyle={({index}) => index % 2 === 1 && {backgroundColor: 'rgba(12, 12, 12, 0.6)'}}
        headerRowRenderer={() => null}
        rowRenderer={(props) => {
          return (
            <SubtitleItem
              key={props.key}
              props={props}
              style={props.style}
              sub={props.rowData}
              selectedSub={selectedSub}
              selectedSpeaker={selectedSpeaker}
              player={player}
              speakSub={async (...params) => {
                if (autoTranslateSub) await translateSub(props.rowData);
                await speakSub(...params);
              }}
              downloadSub={downloadSub}
              showNote={showNote || tutorialEnabled}
            />
          );
        }}
      ></Table>
    </Style>
  );
}
