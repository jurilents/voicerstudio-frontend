import React, { memo } from 'react';
import styled from 'styled-components';
import Subtitles from '../subs/Subtitles';

const Style = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  h3 {
    padding-top: 10px;
    margin-bottom: 5px;
  }
`;


function SubtitlesTab({ dimensions }) {
  if (typeof dimensions?.height !== 'number') dimensions.height = 100;
  if (typeof dimensions?.width !== 'number') dimensions.width = 100;
  return (
    <Style>
      <h3>Subtitles</h3>
      <Subtitles {...dimensions} />
    </Style>
  );
}

export default memo(
  SubtitlesTab,
  (prevProps, nextProps) =>
    prevProps.dimensions && nextProps.dimensions
    && prevProps.dimensions.width === nextProps.dimensions.width
    && prevProps.dimensions.height === nextProps.dimensions.height,
);
