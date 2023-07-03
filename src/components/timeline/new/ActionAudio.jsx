const ActionAudio = ({ action, row }) => {
  return (
    <div className='timeline-audio'>
      {(action.end - action.start).toFixed(2)}s
    </div>
  );
};

export default ActionAudio;
