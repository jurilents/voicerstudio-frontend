const highlightClass = 'tutor-highlight';

const steps = (t) => {
  return [
    {
      element: '.bot-link',
      intro: t('tutors.welcome.steps.authorizerBot'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.tab-btn-presets',
      intro: t('tutors.welcome.steps.authorizerBotNext'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.tab-btn-speakers',
      intro: t('tutors.welcome.steps.speakersTab'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.tab-btn-mixer',
      intro: t('tutors.welcome.steps.mixerTab'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.tab-btn-markers',
      intro: t('tutors.welcome.steps.markersTab'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.tab-btn-import',
      intro: t('tutors.welcome.steps.importAndBackupTab'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.tab-btn-export',
      intro: t('tutors.welcome.steps.exportTab'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.magnet-btn',
      intro: t('tutors.welcome.steps.magnetModeBtn'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.play-pause-btn',
      intro: t('tutors.welcome.steps.playPause'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.record-btn',
      intro: t('tutors.welcome.steps.recordBtn'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.footer-container',
      intro: t('tutors.welcome.steps.timelineGeneral'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.timeline-editor-cursor-area',
      intro: t('tutors.welcome.steps.timelineCursor'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.timeline-editor-time-area-interact',
      intro: t('tutors.welcome.steps.timelineInteract'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.timeline-progress-bar',
      intro: t('tutors.welcome.steps.timelineProgress'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.tab-btn-help',
      intro: t('tutors.welcome.steps.hotkeysAndHelp'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.chat-link',
      intro: t('tutors.welcome.steps.supportChat'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      intro: t('tutors.welcome.steps.nextSteps'),
      position: 'top',
      highlightClass: highlightClass,
    },
  ];
};

// export function WelcomeTutorial() {
//   const tour = useContext(ShepherdTourContext);
//
//   return (
//     <button className="button dark" onClick={tour.start}>
//       Start Tour
//     </button>
//   );
// }

export default {steps};
