import { Timeline } from '@xzdarcy/react-timeline-editor';
import React, { memo, useMemo, useState } from 'react';
import { timelineEffects } from '../../../utils/timelineEffects';
import { useSelector } from 'react-redux';
import ScaleMarker from './action-templates/ScaleMarker';

function calcScaleCount(duration, scale) {
  if (!duration || isNaN(duration)) duration = 60;
  return (duration / scale) + 1;
}

const minScaleWidth = 50;
const maxScaleWidth = 200;

const niceNumbers = [
  1,
  2,
  5,
  10,
  15,
  30,
  60, // 1m
  120, // 2m
  300, // 5m
  600, // 10m
  900, // 15m
  1200, // 20m
  1800, // 30m
  3600, // 1h
  7200, // 2h
  21600, // 6h
  43200, // 12h
  86400, // 24h
];

function calculateScaleAndWidth(zoom, timelineDuration, timelineWidth) {
  if (isNaN(+zoom) || zoom < 0 || zoom > 1) zoom = 1;
  if (isNaN(+timelineDuration)) timelineDuration = 60;
  zoom += 0.05;

  // Step 1: Calculate the visible duration based on the total duration and the zoom level
  const visibleDuration = timelineDuration * zoom;

  // Step 2: Calculate the raw scale and scale width
  let scaleWidth = timelineWidth * zoom;
  let scale = visibleDuration / (timelineWidth / scaleWidth);

  // If scaleWidth is out of its range, adjust it and calculate new scale
  if (scaleWidth < minScaleWidth) {
    scaleWidth = minScaleWidth;
    scale = visibleDuration / (timelineWidth / scaleWidth);
  } else if (scaleWidth > maxScaleWidth) {
    scaleWidth = maxScaleWidth;
    scale = visibleDuration / (timelineWidth / scaleWidth);
  }

  // Step 3: Round the scale to a "nice" number
  scale = niceNumbers.reduce((prev, curr) =>
    Math.abs(curr - scale) < Math.abs(prev - scale) ? curr : prev,
  );

  // Step 4: Recalculate the scaleWidth based on the "nice" scale
  scaleWidth = timelineWidth / (visibleDuration / scale);
  const scaleCount = Math.ceil(visibleDuration / scale);

  return { scale, scaleWidth, scaleCount };
}

window.isPlaying = false;

const TimelineWrap = (props) => {
  const settings = useSelector(store => store.settings);
  // const { selectedSub } = useSelector(store => store.session);
  let [ref, setRef] = useState(null);
  const [zoom, setZoom] = useState({ scale: 1, scaleWidth: 100, scaleCount: 60 });

  // ------- Zoom -------
  useMemo(() => {
    if (ref?.target && !isNaN(props.player.duration)) {
      console.log('zoom recalculating...');
      const zoom = calculateScaleAndWidth(settings.timelineZoom, props.player.duration, ref.target.clientWidth);
      setZoom(zoom);
      // console.log('zoom:', zoom);
    }
  }, [ref, props.player, setZoom, settings.timelineZoom]);

  console.log('redraw wrap!!!');

  if (!props.player) {
    return <></>;
  }

  const scaleCount = calcScaleCount(props.player.duration, 1);
  return (
    <Timeline
      ref={(newRef) => {
        if (!window.timelineEngine) {
          setRef(newRef);
          window.timelineEngine = newRef;
        }
      }}
      startLeft={20}
      scale={zoom.scale}
      scaleWidth={zoom.scaleWidth}
      autoScroll={true}
      autoReRender={false}
      dragLine={settings.scrollableMode}
      gridSnap={settings.magnetMode}
      rowHeight={50}
      editorData={props.data}
      effects={timelineEffects}
      minScaleCount={zoom.scaleCount}
      maxScaleCount={zoom.scaleCount * 2}
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
