import React, { useCallback } from 'react';
import { Table } from 'react-virtualized';
import { download } from '../../../utils';
import { useSelector } from 'react-redux';
import SubtitleItem from './SubtitleItem';
import { useTranslator, useVoicer } from '../../../hooks';
import { toast } from 'react-toastify';
import { Style } from './Subtitles.styles';

export default function Subtitles({ width, height }) {
    const player = useSelector((store) => store.player.videoPlayer);
    const { showNote, autoTranslateSub } = useSelector((store) => store.settings);
    const { selectedSpeaker, selectedSub } = useSelector((store) => store.session);
    const { speakSub } = useVoicer();
    const { translateSub } = useTranslator();

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
                containerStyle={{ marginBottom: '180px' }}
                height={height}
                rowHeight={80}
                scrollToIndex={selectedSpeaker?.subs.findIndex((x) => x.id === selectedSub?.id) || 0}
                rowCount={selectedSpeaker?.subs.length || 0}
                rowGetter={({ index }) => selectedSpeaker.subs[index]}
                rowStyle={({ index }) => index % 2 === 1 && { backgroundColor: 'rgba(12, 12, 12, 0.6)' }}
                headerRowRenderer={() => null}
                rowRenderer={(props) => (
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
                        showNote={showNote}
                    />
                )}
            ></Table>
        </Style>
    );
}
