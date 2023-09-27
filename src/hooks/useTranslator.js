import { patchSub } from '../store/sessionReducer';
import { translateApi } from '../api/axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { Status } from '../api/constants';
import { setSettings } from '../store/settingsReducer';

export const useTranslator = () => {
  const dispatch = useDispatch();
  const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);
  const {
    selectedTranslateSourceLang,
    selectedTranslateTargetLang,
    translateSourceLangs,
    translateTargetLangs,
  } = useSelector(store => store.settings);
  const [langsFetchStatus, setLangsFetchStatus] = useState(Status.none);

  useEffect(() => {
    async function fetchLanguages() {
      setLangsFetchStatus(Status.loading);
      const newLanguages = await translateApi.getLanguages();
      // if (newLanguages..length < 1) {
      //   toast.error('No languages fetched :(');
      //   setLangsFetchStatus(Status.failure);
      //   return;
      // }

      dispatch(setSettings({
        translateSourceLangs: newLanguages.sourceLanguages,
        translateTargetLangs: newLanguages.targetLanguages,
      }));
    }

    if (!translateSourceLangs?.length || !translateTargetLangs?.length) {
      fetchLanguages().catch(err => {
        toast.error(`DeepL translator languages did not fetch`);
        setLangsFetchStatus(Status.failure);
      });
    }
  }, [dispatch, translateSourceLangs, translateTargetLangs]);

  const translateSub = useCallback(async (sub) => {
    if (!sub.canBeVoiced) {
      toast.info('Subtitle cannot be translated, because it is already translated');
      return true;
    }

    const request = {
      texts: [sub.text],
      sourceLang: selectedTranslateSourceLang,
      targetLang: selectedTranslateTargetLang,
    };
    console.log('Single translate request:', request);
    const translationResult = await translateApi.translate(request);
    if (!translationResult?.length) return;
    console.log('Translation result: ', translationResult);

    dispatch(patchSub(sub, {
      note: translationResult[0].translation,
    }));
    // toast.info('🎧 Subtitle translated  🎧');
  }, [dispatch, selectedTranslateSourceLang, selectedTranslateTargetLang]);

  const translateAll = useCallback(async () => {
    if (!selectedSpeaker?.subs?.length) return;

    const textsToVoice = selectedSpeaker.subs.filter(sub => sub.text?.length > 0 && sub.canBeVoiced).map(sub => sub.text);
    if (textsToVoice.length === 0) {
      toast.info('No subtitles to translate');
    }

    const request = {
      texts: textsToVoice,
      sourceLang: selectedTranslateSourceLang,
      targetLang: selectedTranslateTargetLang,
    };
    console.log('Multiple translate request:', request);
    const translationResult = await translateApi.translate(request);
    if (!translationResult?.length) return;
    console.log('Translation result: ', translationResult);

    for (const translation of translationResult) {
      const sub = selectedSpeaker.subs.find(sub => sub.text === translation.text);
      dispatch(patchSub(sub, {
        note: translation.translation,
      }));
    }

    toast.info(`${textsToVoice.length} subtitles translated  🈳`);

  }, [dispatch, selectedSpeaker, selectedTranslateSourceLang, selectedTranslateTargetLang]);

  return { translateSub, translateAll, langsFetchStatus };
};
