import React, { Component } from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './SellerBackendNavigationItems.module.css';
import Logo from '../../shared/images/minimalist-01.png';

class SellerBackendNavigationItems extends Component {
  render() {
    const { navItems } = this.props.navItems;
    const renderCategoryArray = Object.keys(navItems).map((navItem, i) => (
      <NavigationItem
        addIcon
        icon={navItems[navItem].icon}
        key={i}
        linkType='ReactLink'
        to={navItems[navItem].link}
        isSeller
        clicked={() => this.props.clicked(navItem)}
        ActiveNav={navItems[navItem].active}
      >
        {navItem}
      </NavigationItem>
    ));
    return (
      <React.Fragment>
        {/* Geetico */}
        <ul
          className={[classes.NavigationItems, classes.desktopOnly].join(' ')}
        >
          {/* <div className={classes.Logo}>
            <div className={classes.LogoCont}>
              <img src={Logo} width='50px' alt='' />
              <p>Geetico</p>
            </div>
          </div> */}
          {renderCategoryArray}
        </ul>
      </React.Fragment>
    );
  }
}

export default SellerBackendNavigationItems;
