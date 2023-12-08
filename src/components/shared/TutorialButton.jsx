import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleXmark, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';

const StyledButton = styled.button`
  display: flex !important;
  width: auto !important;
  font-size: 20px !important;
  float: right;
  margin: -12px 6px 0 0;
  opacity: 100%;

  &:hover {
    background-color: var(--c-danger);
    color: #fff;
  }

  &.btn-help-enabled {
    background-color: var(--c-danger);

    &:hover {
      background-color: var(--c-success);
    }
  }
`;

export function TutorialButton({enabled, setEnabled}) {
  const {t} = useTranslation();

  return (
    <StyledButton
      className={'btn btn-icon' + (enabled ? ' btn-help-enabled' : '')}
      title={t('showGuide')}
      onClick={() => setEnabled(prev => !prev)}>
      {enabled
        ? <FontAwesomeIcon icon={faCircleXmark}/>
        : <FontAwesomeIcon icon={faQuestionCircle}/>}
    </StyledButton>
  );
}
