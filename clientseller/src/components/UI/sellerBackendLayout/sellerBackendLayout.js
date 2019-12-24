import React, { Component } from 'react';
import classes from './sellerBackendLayout.module.css';
import SellerBackendNavigationItems from '../../SellerBackendNavigationItems/SellerBackendNavigationItems';
import { connect } from 'react-redux';
import HeaderSeller from '../../HeaderSeller/HeaderSeller';
import axios from 'axios';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faHome,
  faBell,
  faShoppingBag
  // faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import { notificationGet } from '../../../store/actions/notifications';
class sellerBackendLayout extends Component {
  componentDidMount() {
    // console.log(this.props);
    this.props.notGet();
  }

  state = {
    scrolled: false,
    navItems: {
      Dashboard: {
        active: this.props.history.location.pathname === '/',
        icon: faHome,
        link: '/'
      },
      Product: {
        active: this.props.history.location.pathname.includes('products'),
        icon: faShoppingBag,
        link: '/sellerpage/products'
      },
      'Orders Management': {
        active: this.props.history.location.pathname === '/sellerpage/order',
        icon: faCartArrowDown,
        link: '/sellerpage/order'
      }
      // Notifications: {
      //   active:
      //     this.props.history.location.pathname === '/sellerpage/notifications',
      //   icon: faBell,
      //   link: '/sellerpage/notifications'
      // }
      // Analytics: {
      //   active:
      //     this.props.history.location.pathname === '/sellerpage/analytics',
      //   icon: faChartBar,
      //   link: '/sellerpage/analytics'
      // }
    }
  };
  onClickedHandler = navItem => {};
  render() {
    // let scrollTimeout = null;
    return (
      <div className={classes.sellerBackendLayout}>
        <HeaderSeller navItems={this.state} />

        <div className={classes.Children}>{this.props.children}</div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    notGet: () => dispatch(notificationGet())
  };
};
export default connect(
  null,
  mapDispatchToProps
)(withRouter(sellerBackendLayout));
