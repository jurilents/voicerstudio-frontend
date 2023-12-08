import React, {memo, useMemo, useState} from 'react';
import styled from 'styled-components';
import Subtitles from '../subs/Subtitles';
import {useTranslation} from 'react-i18next';
import {TutorialButton} from '../../shared/TutorialButton';
import {Steps} from 'intro.js-react';
import SubtitlesTutorial from '../../tutorials/SubtitlesTutorial';

const Style = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  h3 {
    margin-bottom: 5px;
  }
`;

function SubtitlesTab({dimensions}) {
  const [tutorEnabled, setTutorEnabled] = useState(false);
  const {t} = useTranslation();
  const tutorSteps = useMemo(() => SubtitlesTutorial.steps(t), [t]);

  if (typeof dimensions?.height !== 'number') dimensions.height = 100;
  if (typeof dimensions?.width !== 'number') dimensions.width = 100;
  return (
    <Style>
      <h3>
        {t('tabs.subtitles.title')}
        <TutorialButton enabled={tutorEnabled} setEnabled={setTutorEnabled}/>
      </h3>
      <Subtitles {...dimensions} tutorialEnabled={tutorEnabled}/>
      {/* Tutorial Steps */}
      <Steps
        enabled={tutorEnabled}
        initialStep={0}
        steps={tutorSteps}
        onExit={() => {
          setTutorEnabled(false);
        }}
      />
    </Style>
  );
}

export default memo(
  SubtitlesTab,
  (prevProps, nextProps) =>
    prevProps.dimensions &&
    nextProps.dimensions &&
    prevProps.dimensions.width === nextProps.dimensions.width &&
    prevProps.dimensions.height === nextProps.dimensions.height,
);
