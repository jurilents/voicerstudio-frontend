import React, { useCallback } from 'react';
import DT from 'duration-time-conversion';

export const Duration = (props) => {
    const getDuration = useCallback((time) => {
        time = time === Infinity ? 0 : time;
        const displayValue = DT.d2t(time);
        return displayValue.substring(0, displayValue.length - 1);
    }, []);
    return (
        <div className='duration'>
            <span>
                {getDuration(props.currentTime)} / {getDuration(props.player.duration || 0)}
            </span>
        </div>
    );
};
