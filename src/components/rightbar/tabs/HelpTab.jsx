import React, {memo} from 'react';
import styled from 'styled-components';
import {Col, Container, Row} from 'react-bootstrap';
import {settings} from '../../../settings';
import {useTranslation} from 'react-i18next';

const Style = styled.div`
  height: 100%;
  overflow-y: scroll;

  .help-scrollable {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .row {
    margin-bottom: 10px;
  }

  .col:first-child {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .hotkey-title {
    text-align: right;
    height: 100%;
    margin-top: 4px;
  }

  .hotkey-key {
    display: block;
    max-width: 150px;
    font-size: 13px;
    padding: 5px 20px;
    border-radius: 3px;
    text-align: center;
    color: rgb(255 255 255 / 75%);
    background-color: rgb(255 255 255 / 20%);
  }

  .offset {
    height: 30px;
  }
`;

const hotkeys = [
  {title: 'Play/Pause', key: 'Space'},
  {title: 'Delete subtitle', key: 'Del or Backspace'},
  {title: 'Record subtitle', key: 'R (hold)'},
  {title: 'Paste copied text to selected subtitle', key: '⌘ + V', offset: true},
  {title: 'Undo', key: '⌘ + Z'},
  {title: 'Redo', key: '⌘ + ⇧ + Z', offset: true},
  {title: 'Move backward', key: '(⇧) + ←'},
  {title: 'Move forward', key: '(⇧) + →', offset: true},
  {title: 'Add/remove marker', key: 'M'},
  {title: 'Move to prev marker', key: '⌥ + ←'},
  {title: 'Move to next marker', key: '⌥ + →'},
];

const supportContacts = [
  {
    title: 'Bugs / Technical support',
    link: 'https://t.me/' + settings.supportTelegram,
    displayName: '@' + settings.supportTelegram,
  },
  {
    title: 'Any questions',
    link: 'https://t.me/Lisa_Volkova',
    displayName: '@Lisa_Volkova',
  },
];

function HelpTab() {
  const {t} = useTranslation();

  return (
    <Style className="help pb-4">
      <div className="help-scrollable">
        <h3>{t('tabs.hotkeysAndHelp.titleHotkeys')}</h3>
        <Container>
          {hotkeys.map((hotkey) => (
            <Row key={hotkey.key} className={hotkey.offset ? 'mb-4' : ''}>
              <Col xs={7} className="hotkey-title">
                {hotkey.title}
              </Col>
              <Col xs={5}>
                <span className="hotkey-key">{hotkey.key}</span>
              </Col>
            </Row>
          ))}
        </Container>
        <div className="offset"></div>
        <h3>{t('tabs.hotkeysAndHelp.titleSupport')}</h3>
        <Container>
          {supportContacts.map((contact) => (
            <Row key={contact.link}>
              <Col xs={7} className="hotkey-title">
                {contact.title}
              </Col>
              <Col xs={5}>
                <a href={contact.link} target="_blank" rel="noreferrer" className="hotkey-key">
                  {contact.displayName}
                </a>
              </Col>
            </Row>
          ))}
        </Container>
      </div>
    </Style>
  );
}

export default memo(HelpTab, () => true);
