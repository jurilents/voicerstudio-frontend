import React, {createRef, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import WelcomeTutorial from '../tutorials/WelcomeTutorial';
import {Steps} from 'intro.js-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faNavicon} from '@fortawesome/free-solid-svg-icons';
import {Style} from './Header.styles';


function throttle(f, delay) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => f.apply(this, args), delay);
  };
}

export default function Header() {
  const {t} = useTranslation();
  const [tutorEnabled, setTutorEnabled] = useState(false);
  const headerRef = createRef();
  const [width, setWidth] = useState(1);
  const [showCollapsed, setShowCollapsed] = useState(false);
  const tutorSteps = useMemo(() => WelcomeTutorial.steps(t), [t]);

  useEffect(() => {
    if (!headerRef.current) return;
    const resizeObserver = new ResizeObserver(throttle(() => {
      if (headerRef.current) {
        setWidth(headerRef.current.clientWidth);
      } else {
        resizeObserver.disconnect();
      }
    }, 50));

    resizeObserver.observe(headerRef.current);
    return () => resizeObserver.disconnect();
  }, [headerRef, setWidth]);

  const collapsedMenu = width < 600;

  return (
    <Style ref={headerRef} className="header noselect">
      <div className="logo">
        <a href="https://creativesociety.com/" target="_blank">
          <img src="/public/images/logo-silver.png" alt={t('header.creativeSociety')}/>
        </a>
        <div className="logo-content">
          <span className="logo-title">Voicer Studio</span>
          <span className="logo-version">v2.5.0 – 8/12/23</span>
        </div>
      </div>
      <div className="nav-wrapper">
        {!!collapsedMenu && (
          <div>
            <button
              className="btn nav-toggler-btn"
              onClick={() => setShowCollapsed(prev => !prev)}>
              <FontAwesomeIcon icon={faNavicon}/>
            </button>
          </div>
        )}
        <nav className={(collapsedMenu ? 'nav-collapsed' : '') + (showCollapsed ? ' visible' : ' hidden')}>
          <ul>
            <li className="welcome-tour-btn">
              <button className="link-btn" onClick={() => setTutorEnabled(prev => !prev)}>
                {t('header.welcomeTutor')}
              </button>
            </li>
            <li className="bot-link">
              <a href="https://t.me/voicerstudio_bot" target="_blank">
                {t('header.authorizerBot')}
              </a>
            </li>
            <li className="chat-link">
              <a href="https://t.me/voicerstudio" target="_blank">
                {t('header.telegramChat')}
              </a>
            </li>
            <li>
              <a href="https://text2aspeech.azurewebsites.net/ru/app" target="_blank">
                {t('header.text2Speech')}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      {/* Tutorial Steps */}
      <Steps
        enabled={tutorEnabled}
        initialStep={0}
        steps={tutorSteps}
        onExit={() => {
        }}
      />
    </Style>
  );
}
