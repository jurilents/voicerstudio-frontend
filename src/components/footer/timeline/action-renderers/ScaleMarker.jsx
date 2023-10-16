import { memo } from 'react';

const ScaleMarker = ({ scale }) => {
    const min = parseInt(scale / 60 + '');
    const second = ((scale % 60) + '').padStart(2, '0');
    return <>{`${min}:${second}`}</>;
};

export default memo(ScaleMarker, (prevProps, nextProps) => {
    return prevProps.scale === nextProps.scale;
});
