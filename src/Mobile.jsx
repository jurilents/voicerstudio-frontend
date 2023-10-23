import styled from 'styled-components';
import {Trans} from 'react-i18next';

const Style = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default function Mobile() {
  return (
    <Style>
      <Trans i18nKey="mobileIsNotSupported"/>
    </Style>
  );
}
