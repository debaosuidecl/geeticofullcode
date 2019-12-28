import React, { Component } from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import { Link, withRouter } from 'react-router-dom';
import classes from './TopNavigationItems.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartArrowDown,
  faSearch,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../UI/SearchBar/SearchBar';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import DesktopDropDown from '../DesktopDropDown/DesktopDropDown';
import { connect } from 'react-redux';
import { authLogOut } from '../../store/actions/auth';
import Logo from '../../shared/images/minimalist-01.png';
import App from '../../App';
// import Backdrop from '../UI/Backdrop/Backdrop';
import { fetchAllCartItems, showCartPreview } from '../../store/actions/cart';
import CartPreview from '../CartPreview/CartPreview';
import Toggler from '../UI/Toggler/Toggler';
import SearchSuggestion from '../SearchSuggestions/SearchSuggestion';
import NotificationDropDown from '../NotificationDropDown/NotificationDropDown';
import { notificationGet } from '../../store/actions/notifications';
class NavigationItems extends Component {
  state = {
    search: '',
    suggestions: [],
    showDropDown: false,
    showNavDesktop: false,
    showNotificationDesktop: false
  };
  componentWillMount() {
    document.addEventListener('mousedown', this.closeNavDesktop);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeNavDesktop);
  }
  closeNavDesktop = e => {
    if (this.node.contains(e.target)) {
      return;
    }
    this.setState({
      showDropDown: false,
      showNavDesktop: false,
      showNotificationDesktop: false
    });
  };
  componentDidMount() {
    this.props.onFetchCartItems();
    this.props.onNotGet();
  }
  textChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
    // console.log(e.target.value);

    if (e.target.value.length > 2) {
      // console.log('go');
      axios
        .get(`${App.domain}api/userproducts/1?search=${e.target.value}`)
        .then(response => {
          // console.log(response);
          this.setState({ suggestions: response.data });
          if (response.data.length > 0) {
            this.setState({ showDropDown: true });
          } else {
            this.setState({ showDropDown: false });
          }
        })
        .catch(e => {
          console.log(e.response);
        });
    }
  };
  keyDownHandler = e => {};
  onBlurHandler = e => {
    this.setState({ showDropDown: false });
  };
  onFocusHandler = () => {
    this.setState({ showDropDown: true });
  };
  showNavDesktopHandler = () => {
    this.setState(prevState => {
      return {
        showNavDesktop: !prevState.showNavDesktop
      };
    });
  };
  showNotificationHandler = () => {
    this.setState(prevState => {
      return {
        showNotificationDesktop: !prevState.showNotificationDesktop
      };
    });
  };

  render() {
    const element = (
      <span className={classes.CartIconContainer}>
        <FontAwesomeIcon size='lg' icon={faCartArrowDown} />
      </span>
    );
    {
      this.props.authSuccessReload
        ? document.querySelector('#authSuccess').click()
        : document.querySelector('#authSuccess').blur();
    }

    return (
      <ul className={classes.NavigationItems} ref={node => (this.node = node)}>
        <div className=''>
          <DesktopDropDown show={this.state.showNavDesktop} />
          <Toggler
            color='#333'
            forceShow
            clicked={this.showNavDesktopHandler}
          />
        </div>
        <Link to='/' style={{ display: 'flex' }}>
          <img src={Logo} width={40} alt='' style={{ marginRight: 10 }} />
          <h1 className={classes.Header}>Geetico</h1>
        </Link>
        <div className={classes.CartAndAvatar}>
          <div
            className={classes.InputContainer}
            ref={node => (this.node = node)}
          >
            <SearchBar
              search={this.state.search}
              clicked={() => {
                if (this.state.search.length > 2)
                  window.location.href = `/search?search=${this.state.search}`;
              }}
              textChangeHandler={this.textChangeHandler}
              searchIcon={faSearch}
              keyDownHandler={this.keyDownHandler}
            />
            <SearchSuggestion
              showDropDown={this.state.showDropDown}
              suggestions={this.state.suggestions}
            />
          </div>
          {this.props.hideCheckoutDrop ? null : (
            <div className={classes.CheckOutDrop}>
              <button
                onClick={() => this.props.onToggleCartPreview()}
                className={classes.CheckoutButton}
              >
                {' '}
                {element}Cart{' '}
                <span className={classes.CartNumber}>
                  {this.props.itemCount}
                </span>
              </button>
              <CartPreview
                toggleCartPreview={this.props.onToggleCartPreview}
                showCart={this.props.showCart}
                cart={this.props.cart}
              />
            </div>
          )}
        </div>
        <div onClick={this.props.clickForModal}>
          {this.props.isAuthenticated ? null : (
            <NavigationItem
              linkType='ReactLink'
              to='#'
              className={classes.Help}
            >
              Login/Sign Up
            </NavigationItem>
          )}
        </div>
        {!this.props.isAuthenticated ? null : (
          <div
            onClick={this.showNotificationHandler}
            className={classes.Notification}
            ref={node => (this.node = node)}
          >
            <FontAwesomeIcon icon={faBell} size='1x' />
            <span>
              Notifications <strong>({this.props.notificationCount})</strong>
            </span>
            <NotificationDropDown
              show={this.state.showNotificationDesktop}
              notifications={this.props.notifications}
            />

            {/* <span className={classes.NotificationCount}>4</span> */}
          </div>
        )}
      </ul>
    );
  }
}
const mapStateToProps = state => {
  console.log(state, 'for notifications from tni');
  return {
    // itemCount: state.cart.itemCount,
    isAuthenticated: state.auth.token !== null,
    showCart: state.cart.showCart,
    fullName: state.auth.fullName,
    cart: state.cart.cartItems,
    email: state.auth.email,
    avatar: state.auth.avatar,
    notifications: state.notification.notifications,
    notificationCount: state.notification.notificationCount,
    authSuccessReload: state.auth.authSuccessReload
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogOut()),
    onFetchCartItems: () => dispatch(fetchAllCartItems()),
    onToggleCartPreview: () => dispatch(showCartPreview()),
    onNotGet: () => dispatch(notificationGet())
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavigationItems)
);
