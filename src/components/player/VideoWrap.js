import React, { createRef, memo, useCallback, useEffect } from 'react';
import { isPlaying } from '../../utils';

export const VideoWrap = memo(({ setPlayer, setCurrentTime, setPlaying }) => {
    const $video = createRef();

    useEffect(() => {
        setPlayer($video.current);
        (function loop() {
            window.requestAnimationFrame(() => {
                if ($video.current) {
                    setPlaying(isPlaying($video.current));
                    setCurrentTime($video.current.currentTime || 0);
                }
                loop();
            });
        })();
    }, [setPlayer, setCurrentTime, setPlaying, $video]);

    const onClick = useCallback(() => {
        if ($video.current) {
            if (isPlaying($video.current)) {
                $video.current.pause();
            } else {
                $video.current.play();
            }
        }
    }, [$video]);

    return <video onClick={onClick} src='/sample.mp4?t=1' ref={$video} controls={true} />;
}, () => true);
