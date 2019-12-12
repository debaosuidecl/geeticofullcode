import React, { Component } from 'react';
import classes from './sellerBackendLayout.module.css';
import SellerBackendNavigationItems from '../../SellerBackendNavigationItems/SellerBackendNavigationItems';
import HeaderSeller from '../../HeaderSeller/HeaderSeller';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faHome,
  faChartBar,
  faShoppingBag
  // faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
class sellerBackendLayout extends Component {
  componentDidMount() {
    // console.log(this.props);
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
      // 'Inventory Management': {
      //   active:
      //     this.props.history.location.pathname === '/sellerpage/inventory',
      //   icon: faWarehouse,
      //   link: '/sellerpage/inventory'
      // },
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
        {/* <div className={classes.sellerBackendBody}> */}
        <HeaderSeller navItems={this.state} />
        {/* <div className={classes.NavContainer}>
          <SellerBackendNavigationItems
            navItems={this.props.state}
            clicked={this.onClickedHandler}
          />
        </div> */}
        <div className={classes.Children}>{this.props.children}</div>
      </div>
    );
  }
}

export default withRouter(sellerBackendLayout);
