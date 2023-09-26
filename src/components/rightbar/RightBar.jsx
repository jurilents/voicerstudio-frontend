import React, { memo } from 'react';
import { faCircleQuestion, faComments } from '@fortawesome/free-solid-svg-icons';
import HelpTab from './tabs/HelpTab';
import Toolbar from '../shared/Toolbar';
import SubtitlesTab from './tabs/SubtitlesTab';

const tabs = [
  {
    key: 'subs',
    title: 'Subtitles',
    icon: faComments,
    component: SubtitlesTab,
    compact: true,
  },
  // {
  //   key: 'history',
  //   title: 'History',
  //   icon: faClipboardList,
  //   component: HistoryTab,
  // },
  {
    key: 'help',
    title: 'Hotkeys & Help',
    icon: faCircleQuestion,
    component: HelpTab,
    compact: true,
  },
];

const RightBar = (props) => {
  return (
    <Toolbar tabs={tabs}
             selectByDefault='subs'
             props={props} />
  );
};

export default memo(
  RightBar,
  (prevProps, nextProps) =>
    prevProps.dimensions && nextProps.dimensions
    && prevProps.dimensions.width === nextProps.dimensions.width
    && prevProps.dimensions.height === nextProps.dimensions.height,
);
