import React, { useCallback, useEffect, useState } from 'react';
import clamp from 'lodash/clamp';

export const Grab = (props) => {
    const [grabStartX, setGrabStartX] = useState(0);
    const [grabStartTime, setGrabStartTime] = useState(0);
    const [grabbing, setGrabbing] = useState(false);

    const onGrabDown = useCallback(
        (event) => {
            if (event.button !== 0) return;
            setGrabStartX(event.pageX);
            setGrabStartTime(props.player.currentTime);
            setGrabbing(true);
        },
        [props.player],
    );

    const onGrabUp = () => {
        setGrabStartX(0);
        setGrabStartTime(0);
        setGrabbing(false);
    };

    const onGrabMove = useCallback(
        (event) => {
            if (grabbing && props.player && props.waveform) {
                const currentTime = clamp(
                    grabStartTime - ((event.pageX - grabStartX) / document.body.clientWidth) * 10,
                    0,
                    props.player.duration,
                );
                props.player.currentTime = currentTime;
                props.waveform.seek(currentTime);
            }
        },
        [grabbing, props.player, props.waveform, grabStartX, grabStartTime],
    );

    useEffect(() => {
        document.addEventListener('mouseup', onGrabUp);
        return () => document.removeEventListener('mouseup', onGrabUp);
    }, []);

    return (
        <div className={`grab ${grabbing ? 'grabbing' : ''}`} onMouseDown={onGrabDown} onMouseMove={onGrabMove}></div>
    );
};
