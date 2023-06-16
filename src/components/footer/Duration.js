import React from 'react';
import { d2t } from '../../utils';

export const Duration = (props) => {
  return (
    <div className='duration'>
            <span>
                {d2t(props.currentTime)} / {d2t(props.player.duration || 0)}
            </span>
    </div>
  );
};
