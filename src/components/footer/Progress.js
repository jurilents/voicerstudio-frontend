import React, { useCallback, useEffect, useState } from 'react';

export const Progress = (props) => {
    const [grabbing, setGrabbing] = useState(false);

    const onProgressClick = useCallback(
        (event) => {
            if (event.button !== 0) return;
            const currentTime = (event.pageX / document.body.clientWidth) * props.player.duration;
            props.player.currentTime = currentTime;
            props.waveform.seek(currentTime);
        },
        [props],
    );

    const onGrabDown = useCallback(
        (event) => {
            if (event.button !== 0) return;
            setGrabbing(true);
        },
        [setGrabbing],
    );

    const onGrabMove = useCallback(
        (event) => {
            if (grabbing) {
                const currentTime = (event.pageX / document.body.clientWidth) * props.player.duration;
                props.player.currentTime = currentTime;
            }
        },
        [grabbing, props.player],
    );

    const onDocumentMouseUp = useCallback(() => {
        if (grabbing) {
            setGrabbing(false);
            props.waveform.seek(props.player.currentTime);
        }
    }, [grabbing, props.waveform, props.player.currentTime]);

    useEffect(() => {
        document.addEventListener('mouseup', onDocumentMouseUp);
        document.addEventListener('mousemove', onGrabMove);
        return () => {
            document.removeEventListener('mouseup', onDocumentMouseUp);
            document.removeEventListener('mousemove', onGrabMove);
        };
    }, [onDocumentMouseUp, onGrabMove]);

    return (
        <div className='progress' onClick={onProgressClick}>
            <div className='bar' style={{ width: `${(props.currentTime / props.player.duration) * 100}%` }}>
                <div className='handle' onMouseDown={onGrabDown}></div>
            </div>
            <div className='subtitle'>
                {props.subtitle.length <= 200
                    ? props.subtitle.map((item, index) => {
                        const { duration } = props.player;
                        return (
                            <span
                                key={index}
                                className='item'
                                style={{
                                    left: `${(item.startTime / duration) * 100}%`,
                                    width: `${(item.duration / duration) * 100}%`,
                                }}
                            ></span>
                        );
                    })
                    : null}
            </div>
        </div>
    );
};
