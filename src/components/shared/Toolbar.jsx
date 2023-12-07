import {Style} from './Toolbar.styles';
import {Nav, Tab} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';

const Toolbar = ({tabs, selectByDefault, props}) => {
  return (
    <Style className="tool noselect">
      <Tab.Container defaultActiveKey={selectByDefault}>
        <Nav variant="pills" className="tabs-buttons">
          {tabs.map((tab) => (
            <Nav.Item key={tab.key} className={'tab-btn-' + tab.key}>
              <Nav.Link as="span" eventKey={tab.key} title={tab.title}>
                <FontAwesomeIcon icon={tab.icon}/>
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <Tab.Content>
          {tabs.map((tab) => (
            <Tab.Pane eventKey={tab.key} key={tab.key} className={tab.compact ? 'compact-tab' : ''}>
              <tab.component {...props} />
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
    </Style>
  );
};

export default Toolbar;
