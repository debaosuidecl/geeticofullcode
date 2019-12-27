import React, { Component } from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './SellerBackendMobNavItems.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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

        <div
          onClick={this.props.goToNotification}
          className={classes.NotificationLink}
        >
          Notifications ({this.props.notificationCount})
        </div>
        <div>
          <span className={classes.Logout} onClick={this.props.logoutHandler}>
            Logout
          </span>
        </div>
      </ul>
    );
  }
}
const mapStateToProps = state => {
  return {
    notificationCount: state.notification.notificationCount
  };
};
export default connect(mapStateToProps)(withRouter(SellerBackendMobNavItems));
