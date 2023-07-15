import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Toolbar from './components/toolbar/Toolbar';
import Subtitles from './components/sidebar/Subtitles';
import Player from './components/player/Player';
import Footer from './components/timeline/Footer';
import Loading from './components/Loading';
import ProgressBar from './components/header/ProgressBar';
import Header from './components/header/Header';
import { useSubsAudioStorage, useVideoStorage } from './hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setVideo } from './store/sessionReducer';
import { ToastContainer } from 'react-toastify';
import { VoicedStatuses } from './models/Sub';
import { addAudio } from './store/audioReducer';
import 'react-toastify/dist/ReactToastify.css';
import HotkeysWrap from './components/HotkeysWrap';

const Style = styled.div`
  height: 100%;
  width: 100%;

  .main {
    display: flex;
    height: calc(100% - 410px);
    justify-content: flex-end;
    //padding-bottom: 35px;

    .subtitles {
      padding-top: 5px;
      width: 600px;
      overflow: hidden;
      position: relative;
      //box-shadow: 0px 5px 25px 5px rgb(0 0 0 / 80%);
      background-color: rgba(0, 0, 0, 50%);
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex: 1;
    height: 100%;
    max-height: 100%;
  }

  .left-content {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex: 1;
    height: calc(100% - 60px);
  }
`;

export default function App({ defaultLang }) {
  const dispatch = useDispatch();
  const { videoUrl, speakers } = useSelector(store => store.session);
  const { loadVideo } = useVideoStorage();
  const { loadSubAudio } = useSubsAudioStorage();

  const subtitleHistory = useRef([]);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState('');
  const [processing, setProcessing] = useState(0);
  const [language, setLanguage] = useState(defaultLang);
  const [preset, setPreset] = useState('');
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLang, setCurrentLang] = useState(null);

  useEffect(() => {
    async function load() {
      const url = await loadVideo('video1');
      dispatch(setVideo(url));

      for (const speaker of speakers) {
        for (const sub of speaker.subs) {
          if (sub.data && sub.voicedStatus === VoicedStatuses.voiced) {
            sub.data.src = await loadSubAudio(sub.id);
            dispatch(addAudio(sub.data.src));
          }
        }

      }
    }

    if (videoUrl) {
      load();
    }
  }, []);

  const props = {
    player,
    setPlayer,
    currentTime,
    setCurrentTime,
    playing,
    setPlaying,
    language,
    setLanguage,
    loading,
    setLoading,
    setProcessing,
    subtitleHistory,

    preset,
    setPreset,

    recording,
    setRecording,
    currentLang,
    setCurrentLang,
  };

  return (
    <Style>
      <div className='main'>
        <div className='left'>
          <Header {...props} />
          <div className='left-content'>
            <Toolbar {...props} />
            <Player {...props} />
          </div>
        </div>
        <div className='subtitles'>
          <Subtitles {...props} />
        </div>
      </div>
      <Footer {...props} />
      {loading ? <Loading loading={loading} /> : null}
      {processing > 0 && processing < 100 ? <ProgressBar processing={processing} /> : null}
      <ToastContainer
        position='top-center'
        theme='dark'
        autoClose={6000}
        limit={4}
        newestOnTop={false}
        draggable
        closeOnClick
        pauseOnHover
        hideProgressBar
        pauseOnFocusLoss
      />
      {player && <HotkeysWrap player={player} />}
    </Style>
  );
}
