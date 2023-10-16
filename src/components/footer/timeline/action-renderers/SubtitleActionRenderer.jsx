import { useSelector } from 'react-redux';
import { getSubVoicedStatusColor } from '../../../../models';
import { useMemo } from 'react';

const SubtitleActionRenderer = ({ action, row }) => {
    const { selectedSub, selectedSpeaker } = useSelector((store) => store.session);
    action.selected = action.id === selectedSub?.id;
    row.selected = row.id === selectedSpeaker?.id;
    const voicingColor = useMemo(() => getSubVoicedStatusColor(action), [action]);

    return (
        <div
            className={[
                'timeline-sub',
                row.selected ? 'focus-sub' : '',
                action.selected ? 'selected-sub' : '',
                action.recording ? 'recording-sub' : '',
                action.invalidStart || action.invalidEnd ? 'illegal' : '',
            ]
                .join(' ')
                .trim()}
            style={{
                backgroundColor: row.color,
            }}
        >
            <span className="sub-text">{action.text}</span>
            <div className="sub-footer">
                <span className="sub-time">{(action.end - action.start).toFixed(2)}</span>
                <span className="sub-status" style={{ backgroundColor: voicingColor }}></span>
            </div>
        </div>
    );
};

export default SubtitleActionRenderer;
