import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.css';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

import {
  faShoppingCart,
  faSearchLocation
} from '@fortawesome/free-solid-svg-icons';
import Toggler from '../UI/Toggler/Toggler';
import { toggleAuthModalAction, authLogOut } from '../../store/actions/auth';
import App from '../../App';

const slideForMobile = [classes.DropDown, classes.MobileOnly];
const shouldSlideArray = slideForMobile.concat(classes.Dropped);

class SideDrawer extends React.Component {
  state = {};
  goToCategoryHandler = () => {};

  render() {
    let NavItems = null;
    let selectedCat = null;
    // let selectedCatItems = null;

    NavItems = (
      <div>
        <h3 className={classes.CategoriesHeader}>Categories</h3>
        {/* <NavigationItems clicked={this.goToCategoryHandler} /> */}
        <div className={classes.Body} {...this.props}>
          {App.allowedCategories.map((a, i) => (
            <div key={i}>
              <a href={`/category/${a}`}>{a}</a>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div
        className={
          this.props.shouldslidein
            ? slideForMobile.join(' ')
            : shouldSlideArray.join(' ')
        }
      >
        <div className={classes.NavigationItemsContainer}>
          <div className={classes.TogglerLogoCont}>
            <Toggler
              isToggled={this.props.istoggled}
              clicked={this.props.clicked}
            />
            {/* <h1 className={classes.Header}>Geetico.ng</h1> */}
          </div>
          {!this.props.isAuthenticated ? (
            <div
              className={classes.AuthButtons}
              onClick={this.props.onshowauthmodaltoggle}
            >
              <button>Sign in / Sign up</button>
            </div>
          ) : (
            <div className={classes.AuthButtons} onClick={this.props.onlogout}>
              <button>Logout</button>
            </div>
          )}

          <div className={classes.FourBoxLayout}>
            <div className={classes.ContactUsHelpTrackCartCont}>
              {/* <div>
                <p>
                  <FontAwesomeIcon icon={faEnvelope} size='1x' />
                  Contact Us
                </p>
              </div>
              <div>
                <p>
                  <FontAwesomeIcon icon={faInfo} size='1x' />
                  Help
                </p>
              </div> */}
            </div>
            <div className={classes.ContactUsHelpTrackCartCont}>
              <div>
                <p onClick={() => this.props.history.push('/orders')}>
                  <FontAwesomeIcon icon={faSearchLocation} size='1x' />
                  Track Your Order
                </p>
              </div>
              <div>
                <p onClick={() => this.props.history.push('/cart')}>
                  <FontAwesomeIcon icon={faShoppingCart} size='1x' />
                  {this.props.itemCount} Cart items
                </p>
              </div>
            </div>
          </div>
          <div className=''>
            <p
              className={classes.Notification}
              onClick={() => this.props.history.push('/')}
            >
              Notifications ({this.props.notificationCount})
            </p>
          </div>
          {selectedCat}
          {NavItems}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    cart: state.cart.cartItems,
    isAuthenticated: state.auth.token !== null,
    itemCount: state.cart.itemCount,
    notificationCount: state.notification.notificationCount
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // onFetchCart: () => dispatch(fetchCart()),
    onshowauthmodaltoggle: () => dispatch(toggleAuthModalAction()),
    onlogout: () => dispatch(authLogOut())
    // onSetAuthModalToTrue: () => dispatch(setAuthModalToTrue())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SideDrawer)
);
