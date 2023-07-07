import { useSelector } from 'react-redux';

const ActionSubtitle = ({ action, row }) => {
  const { selectedSub, selectedSpeaker } = useSelector(store => store.session);
  action.selected = action.id === selectedSub?.id;
  row.selected = row.id === selectedSpeaker?.id;

  return (
    <div className={[
      'timeline-sub',
      row.selected ? 'focus-sub' : '',
      action.selected ? 'selected-sub' : '',
      action.recording ? 'recording-sub' : '¬',
    ].join(' ').trim()} style={{ backgroundColor: row.color }}>
      <span className='sub-text'>{action.text}</span>
      <span className='sub-time'>{(action.end - action.start).toFixed(2)}s</span>
    </div>
  );
};

export default ActionSubtitle;
