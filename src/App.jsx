import React, { useEffect } from 'react';
import styled from 'styled-components';
import Footer from './components/footer/Footer';
import { useSubsAudioStorage, useVideoStorage } from './hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setVideo } from './store/sessionReducer';
import { ToastContainer } from 'react-toastify';
import { VoicedStatuses } from './models';
import { addAudio } from './store/audioReducer';
import 'react-toastify/dist/ReactToastify.css';
import 'react-reflex/styles.css';
import HotkeysWrap from './components/HotkeysWrap';
import CatWrap from './components/CatWrap';
import audioController from './utils/AudioController';
import debounce from 'lodash/debounce';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import LeftBar from './components/leftbar/LeftBar';
import Player from './components/player/Player';
import RightBar from './components/rightbar/RightBar';
import Header from './components/header/Header';

const Style = styled.div`
    height: 100%;
    width: 100%;

    .main {
        display: flex;
        height: calc(100% - 410px);
        justify-content: flex-end;
        //padding-bottom: 35px;

        .right {
            //width: 600px;
            overflow: hidden;
            position: relative;
            //box-shadow: 0px 5px 25px 5px rgb(0 0 0 / 80%);
            //background-color: rgba(0, 0, 0, 50%);
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

        .tool {
            max-width: 420px;
        }
    }

    .tool .tab-content {
        overflow: hidden;
        padding: 0;
    }

    .left-content {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        flex: 1;
        height: calc(100% - 60px);
    }

    .footer-container {
        background-color: rgb(0 0 0 / 50%);
        position: relative;
        padding-bottom: 35px;
    }

    .layout-center {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
`;

export default function App() {
    const dispatch = useDispatch();
    const { videoUrl, speakers } = useSelector((store) => store.session);
    const { loadVideo } = useVideoStorage();
    const { loadSubAudio } = useSubsAudioStorage();

    useEffect(() => {
        async function load() {
            const url = await loadVideo('video1');
            if (videoUrl === url) return;
            dispatch(setVideo(url));
            const engine = window.timelineEngine;

            for (const speaker of speakers) {
                for (const sub of speaker.subs) {
                    if (sub.data && sub.voicedStatus === VoicedStatuses.voiced) {
                        sub.data.src = await loadSubAudio(sub.id);
                        audioController.addFromSub(sub, engine);
                        dispatch(addAudio(sub.data.src));
                    }
                }
            }
        }

        if (videoUrl) {
            debounce(load, 100)();
        }
    }, []);

    return (
        <Style>
            <ReflexContainer orientation="horizontal">
                <ReflexElement className="main">
                    <ReflexContainer orientation="vertical">
                        <ReflexElement minSize={280}>
                            <LeftBar />
                        </ReflexElement>

                        <ReflexSplitter />

                        <ReflexElement minSize={340}>
                            <div className="layout-center">
                                <Header />
                                <Player />
                            </div>
                        </ReflexElement>

                        <ReflexSplitter />

                        <ReflexElement minSize={360} propagateDimensions={true}>
                            <RightBar />
                        </ReflexElement>
                    </ReflexContainer>
                </ReflexElement>

                <ReflexSplitter />

                <ReflexElement className="footer-container" minSize={100} maxSize={450}>
                    <Footer />
                </ReflexElement>
            </ReflexContainer>
            {/*{loading ? <Loading loading={loading} /> : null}*/}
            {/*{processing > 0 && processing < 100 ? <ProgressBar processing={processing} /> : null}*/}
            <ToastContainer
                position="top-center"
                theme="dark"
                autoClose={6000}
                limit={4}
                newestOnTop={false}
                draggable
                closeOnClick
                pauseOnHover
                hideProgressBar
                pauseOnFocusLoss
            />
            <HotkeysWrap />
            <CatWrap />
        </Style>
    );
}
