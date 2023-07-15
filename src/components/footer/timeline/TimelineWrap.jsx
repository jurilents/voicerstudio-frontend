import { Timeline } from '@xzdarcy/react-timeline-editor';
import React, { memo } from 'react';
import { timelineEffects } from '../../../utils/timelineEffects';
import { useSelector } from 'react-redux';
import ScaleMarker from './action-templates/ScaleMarker';

function calcScaleCount(duration, scale) {
  if (!duration || isNaN(duration)) {
    duration = 60;
  }
  return (duration / scale) + 1;
}

window.isPlaying = false;

const TimelineWrap = (props) => {
  const settings = useSelector(store => store.settings);
  // const { selectedSub } = useSelector(store => store.session);
  let ref = null;

  console.log('redraw wrap!!!!!!');

  if (!props.player) {
    return <></>;
  }

  const scaleCount = calcScaleCount(props.player.duration, 1);
  return (
    <Timeline
      ref={(newRef) => {
        ref = newRef;
        if (!window.timelineEngine) {
          window.timelineEngine = newRef;
        }
      }}
      startLeft={props.startLeft}
      scale={props.scale}
      scaleWidth={props.scaleWidth}
      autoScroll={true}
      autoReRender={false}
      dragLine={settings.scrollableMode}
      gridSnap={settings.magnetMode}
      rowHeight={50}
      editorData={props.data}
      effects={timelineEffects}
      minScaleCount={scaleCount}
      maxScaleCount={scaleCount * 10}
      // ----- Event Handlers -----
      onChange={(data) => {
      }}
      onScroll={props.onScroll}
      // Cursor
      onCursorDragEnd={props.onTimeChange}
      onCursorDrag={props.onTimeChange}
      // Time area
      onClickTimeArea={(time) => {
        console.log('click!', time);
        props.onTimeChange(time);
      }}
      // Action
      onClickAction={(event, param) => {
        if (ref) ref.reRender();
        props.onClickAction(param);
      }}
      onDoubleClickAction={(event, param) => {
        if (ref) ref.reRender();
        props.onDoubleClickAction(param);
      }}
      onActionResizing={props.onActionResizing}
      onActionResizeEnd={props.onActionResizing}
      onActionResizeStart={props.onActionResizeStart}
      onActionMoveStart={props.onActionMoveStart}
      onActionMoveEnd={props.onActionMoving}
      // Row
      onClickRow={(event, param) => {
        if (ref) ref.reRender();
        props.onClickRow(param);
      }}
      onDoubleClickRow={(event, param) => {
        if (ref) ref.reRender();
        window.timelineEngine.reRender();
        props.onDoubleClickRow(param);
      }}
      // ----- Renderers -----
      getScaleRender={(scale) => <ScaleMarker scale={scale} />}
      getActionRender={props.getActionRender}
    />
  );
};

export default memo(
  TimelineWrap,
  (prevProps, nextProps) => {
    return prevProps.data === nextProps.data
      && nextProps.player && prevProps.player?.src === nextProps.player.src;
  },
);
