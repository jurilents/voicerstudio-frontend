import React, { memo } from 'react';
import {
    faBookmark,
    faCloudArrowDown,
    faCloudArrowUp,
    faGear,
    faHeadphonesAlt,
    faRobot,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import MixerTab from './tabs/MixerTab';
import ExportTab from './tabs/ExportTab';
import SpeakersTab from './tabs/SpeakersTab';
import PresetsTab from './tabs/PresetsTab';
import ImportTab from './tabs/ImportTab';
import MarkersTab from './tabs/MarkersTab';
import Toolbar from '../shared/Toolbar';
import GeneralTab from './tabs/GeneralTab';

const tabs = [
    {
        key: 'configuration',
        title: 'Configuration',
        icon: faGear,
        component: GeneralTab,
    },
    {
        key: 'presets',
        title: 'Voicing bots',
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
];

const LeftBar = (props) => {
    return <Toolbar tabs={tabs} selectByDefault="presets" props={props} />;
};

export default memo(LeftBar, (prevProps, nextProps) => {
    return nextProps.player && prevProps.player?.src === nextProps.player?.src;
});
