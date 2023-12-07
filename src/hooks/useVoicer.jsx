import {patchSub} from '../store/sessionReducer';
import {validateSubs, VoicedStatuses} from '../models';
import {speechApi} from '../api/axios';
import {toast} from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import {useSubsAudioStorage} from './useSubsAudioStorage';
import React, {useCallback} from 'react';
import {settings} from '../settings';
import {download} from '../utils';
import {VoicingService} from '../models/enums';

export const useVoicer = () => {
    const dispatch = useDispatch();
    const {exportCodec, exportFormat, exportFileName} = useSelector((store) => store.settings);
    const {selectedSpeaker, selectedCredentials} = useSelector((store) => store.session);
    const {saveSubAudio} = useSubsAudioStorage();

    const speakSub = useCallback(
        async (sub, options) => {
            if (!options) options = {};
            if (!selectedSpeaker.preset) {
                toast.warn('Cannot voice subtitles of selected speaker. Select a voice preset before voicing');
                return false;
            }
            if (!sub.canBeVoiced) {
                if (!options.fromBatch) toast.info('Subtitle cannot be voiced, because it is already voiced');
                return true;
            }

            const cred = selectedCredentials[selectedSpeaker.preset.service.key]
                ?? selectedCredentials[VoicingService.AuthorizerBot.key];
            if (!cred?.value) {
                toast.error('Credentials are not valid');
                return false;
            }

            const request = {
                service: selectedSpeaker.preset.service.key,
                locale: selectedSpeaker.preset.locale,
                voice: selectedSpeaker.preset.voice,
                text: sub.text,
                style: selectedSpeaker.preset.style,
                styleDegree: selectedSpeaker.preset.styleDegree,
                // role: 'string',
                pitch: selectedSpeaker.preset.pitch,
                volume: 1,
                start: options.speed === undefined ? sub.startStr : null,
                end: options.speed === undefined ? sub.endStr : null,
                outputFormat: 'wav',
                sampleRate: 'Rate48000',
                speed: options.speed === undefined ? null : options.speed,
            };
            console.log('Single speech request:', request);
            dispatch(
                patchSub(sub, {
                    data: VoicedStatuses.processing,
                }),
            );
            console.log('cred', cred);
            const audio = await speechApi.single(request, cred.value);
            if (!audio) return false;
            console.log('single audio url', audio);

            sub.data = sub.buildVoicedStamp(audio.url, audio.baseDuration);
            // If rate is too high or to low, reset it to default
            if (Math.abs(sub.acceleration) > settings.rateLimit) {
                sub.endTime = sub.start + audio.duration;
            }
            await saveSubAudio(sub.id, audio.blob);

            dispatch(
                patchSub(sub, {
                    end: +(sub.end).toFixed(3),
                    data: sub.data,
                }),
            );
            if (!options.fromBatch) toast.info('🎧 Subtitle voiced  🎧');
            return true;
        },
        [dispatch, selectedSpeaker, selectedCredentials, saveSubAudio],
    );

    const speakAll = useCallback(
        (options) => {
            if (!options) options = {};
            if (!selectedSpeaker?.preset) {
                toast.warn('Cannot voice subtitles of selected speaker. Select a voice preset before voiceover');
                return;
            }

            const cred = selectedCredentials[selectedSpeaker.preset.service.key]
                ?? selectedCredentials[VoicingService.AuthorizerBot.key];
            if (!cred?.value) {
                toast.error('Credentials are not valid');
                return false;
            }

            let promises = [];
            options.fromBatch = true;
            for (const sub of selectedSpeaker.subs) {
                promises.push(speakSub(sub, options));
            }

            Promise.all(promises).then((results) => {
                const voicedCount = results.filter((success) => success).length;

                if (voicedCount === selectedSpeaker.subs.length) {
                    toast.success('All subtitles of the selected speaker are voiced');
                } else if (voicedCount === 0) {
                    toast.warn(`No subtitles of the selected speaker was voiced`);
                } else {
                    toast.warn(`Some subtitles of selected speaker was not voiced`);
                }
            });
        },
        [speakSub, selectedSpeaker, selectedCredentials],
    );

    const ensureExtension = useCallback((fileName, ext) => {
        const extension = '.' + ext.toLowerCase();
        if (typeof fileName === 'string') {
            if (!fileName.trimEnd().endsWith(extension)) {
                return fileName + extension;
            }
            return fileName;
        }
        return extension;
    }, []);

    const buildExportFileName = useCallback(
        (ext) => {
            if (typeof exportFileName === 'string') {
                const fileName = ensureExtension(exportFileName, ext);
                const tz = new Date().getTimezoneOffset() * 60000;
                const date = new Date(Date.now() - tz).toISOString().split('T');
                return fileName
                    .replace(/\{[S|s]}/g, selectedSpeaker.displayName)
                    .replace(/\{[L|l]}/g, selectedSpeaker.preset?.locale || '???')
                    .replace(/\{[F|f]}/g, exportCodec)
                    .replace(/\{[D|d]}/g, date[0])
                    .replace(/\{[T|t]}/g, date[1].substring(0, 5).replaceAll(':', '-'));
            }
        },
        [selectedSpeaker, exportCodec, exportFileName],
    );

    const generateAndExport = useCallback(
        (setIsPending) => {
            async function fetch(fileName) {
                const toastId = toast.loading(<i>Voicing a file for export...</i>);
                setIsPending(true);
                try {
                    console.log(selectedSpeaker.preset);
                    const request = selectedSpeaker.subs.map((sub) => ({
                        service: selectedSpeaker.preset.service,
                        locale: selectedSpeaker.preset.locale,
                        voice: selectedSpeaker.preset.voice,
                        text: sub.text,
                        style: selectedSpeaker.preset.style,
                        styleDegree: selectedSpeaker.preset.styleDegree,
                        // role: 'string',
                        pitch: selectedSpeaker.preset.pitch,
                        volume: selectedSpeaker.preset.volume || 1,
                        start: sub.startStr,
                        end: sub.endStr,
                        outputFormat: exportFormat,
                        sampleRate: exportCodec,
                    }));
                    console.log('Batch speech request:', request);
                    const cred = selectedCredentials[selectedSpeaker.preset.service];
                    const audio = await speechApi.batch(request, cred.value);
                    console.log('result audio url', audio);
                    download(audio.url, fileName);
                    toast.update(toastId, {
                        render: (
                            <>
                                Export file "<b>{fileName}</b>" succeed
                            </>
                        ),
                        type: 'success',
                        isLoading: false,
                        autoClose: 5000,
                    });
                } catch (err) {
                    toast.update(toastId, {
                        render: <>Export file failed</>,
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000,
                    });
                }
                setIsPending(false);
            }

            if (!selectedSpeaker?.preset) {
                toast.warn('Cannot voice subtitles of selected speaker. Select a voice preset before voiceover');
                return;
            }

            const cred = selectedCredentials[selectedSpeaker.preset.service.key]
                ?? selectedCredentials[VoicingService.AuthorizerBot.key];
            if (!cred?.value) {
                toast.error('Credentials are not valid');
                return false;
            }

            if (validateSubs(selectedSpeaker.subs)) {
            }

            const fileName = buildExportFileName(exportFormat);
            fetch(fileName);
        },
        [selectedSpeaker.subs, exportFormat, exportCodec, buildExportFileName],
    );

    return {speakSub, speakAll, buildExportFileName, generateAndExport};
};
