import React from 'react';
import TopNavigationItems from '../../components/TopNavigationItems/TopNavigationItems';
import classes from './TopNavContainer.module.css';

const navContainerArray = [classes.NavContainer, classes.DesktopOnly];

const navContainer = props => (
  <div className={navContainerArray.join(' ')}>
    <TopNavigationItems
      hideCheckoutDrop={props.hideCheckoutDrop}
      itemCount={props.itemCount}
      clickForModal={props.clickForModal}
    />
  </div>
);

export default navContainer;
