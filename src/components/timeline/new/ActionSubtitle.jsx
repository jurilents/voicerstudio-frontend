const ActionSubtitle = ({ action, row }) => {
  return (
    <div className={[
      'timeline-sub',
      row.selected ? 'focus-sub' : '',
      action.selected ? 'selected-sub' : '',
    ].join(' ').trim()} style={{ backgroundColor: row.color }}>
      <span className='sub-text'>{action.text}</span>
      <span className='sub-time'>{(action.end - action.start).toFixed(2)}s</span>
    </div>
  );
};

export default ActionSubtitle;
