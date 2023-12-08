const highlightClass = 'tutor-highlight';

const steps = (t) => {
  return [
    {
      element: '.sub-text',
      intro: t('tutors.subtitles.steps.subText'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.sub-note',
      intro: t('tutors.subtitles.steps.subNote'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.tab-btn-configuration',
      intro: t('tutors.subtitles.steps.openConfigurationToToggleNotes'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.refresh-translations-btn',
      intro: t('tutors.subtitles.steps.translateAllButton'),
      position: 'top',
      highlightClass: highlightClass,
    },
    {
      element: '.sub-time',
      intro: t('tutors.subtitles.steps.subStartEndTime'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.sub-duration',
      intro: t('tutors.subtitles.steps.subDuration'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.sub-acceleration',
      intro: t('tutors.subtitles.steps.subAcceleration'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.sub-reset-speed',
      intro: t('tutors.subtitles.steps.subResetSpeed'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.sub-download',
      intro: t('tutors.subtitles.steps.subDownload'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.sub-speak',
      intro: t('tutors.subtitles.steps.subSpeak'),
      position: 'bottom',
      highlightClass: highlightClass,
    },
    {
      element: '.speak-all-btn',
      intro: t('tutors.subtitles.steps.speakAll'),
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
