import React, { memo } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark,
  faCircleQuestion,
  faClipboardList,
  faCloudArrowDown,
  faCloudArrowUp,
  faGear,
  faHeadphonesAlt,
  faRobot,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import MixerTab from './tabs/MixerTab';
import ExportTab from './tabs/ExportTab';
import HelpTab from './tabs/HelpTab';
import SpeakersTab from './tabs/SpeakersTab';
import PresetsTab from './tabs/PresetsTab';
import { Style } from './Toolbar.styles';
import ImportTab from './tabs/ImportTab';
import MarkersTab from './tabs/MarkersTab';
import HistoryTab from './tabs/HistoryTab';

const tabs = [
  {
    key: 'configuration',
    title: 'Configuration',
    icon: faGear,
    component: MixerTab,
  },
  {
    key: 'presets',
    title: 'Voice Presets',
    icon: faRobot,
    component: PresetsTab,
  },
  {
    key: 'speakers',
    title: 'Speakers',
    icon: faUsers,
    component: SpeakersTab,
  },
  {
    key: 'mixer',
    title: 'Mixer',
    icon: faHeadphonesAlt,
    component: MixerTab,
  },
  {
    key: 'markers',
    title: 'Markers',
    icon: faBookmark,
    component: MarkersTab,
  },
  {
    key: 'import',
    title: 'Import and backup',
    icon: faCloudArrowUp,
    component: ImportTab,
  },
  {
    key: 'export',
    title: 'Export',
    icon: faCloudArrowDown,
    component: ExportTab,
  },
  {
    key: 'history',
    title: 'History',
    icon: faClipboardList,
    component: HistoryTab,
  },
  {
    key: 'help',
    title: 'Hotkeys & Help',
    icon: faCircleQuestion,
    component: HelpTab,
  },
];

const Toolbar = (props) => {
  return (
    <Style className='tool noselect'>
      <Tab.Container id='left-tabs-example' defaultActiveKey='presets'>
        <Nav variant='pills' className='tabs-buttons'>
          {tabs.map((tab) => (
            <Nav.Item key={tab.key}>
              <Nav.Link as='span' eventKey={tab.key} title={tab.title}>
                <FontAwesomeIcon icon={tab.icon} />
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <Tab.Content>
          {tabs.map((tab) => (
            <Tab.Pane eventKey={tab.key} key={tab.key}>
              <tab.component {...props} />
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
    </Style>
  );
};

export default memo(
  Toolbar,
  (prevProps, nextProps) => {
    return nextProps.player && prevProps.player?.src === nextProps.player?.src;
  },
);
