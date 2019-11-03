import React, { Component } from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './SellerBackendMobNavItems.module.css';

class SellerBackendMobNavItems extends Component {
  render() {
    const { navItems } = this.props.navItems;
    let renderCategoryArray;
    if (navItems) {
      renderCategoryArray = Object.keys(navItems).map((navItem, i) => (
        <NavigationItem
          key={i}
          linkType='ReactLink'
          to={navItems[navItem].link}
          isSeller
          ActiveNav={navItems[navItem].active}
        >
          {navItem}
        </NavigationItem>
      ));
    } else {
      renderCategoryArray = null;
    }
    return (
      <ul className={[classes.NavigationItems, classes.desktopOnly].join(' ')}>
        {renderCategoryArray}
      </ul>
    );
  }
}

export default SellerBackendMobNavItems;
