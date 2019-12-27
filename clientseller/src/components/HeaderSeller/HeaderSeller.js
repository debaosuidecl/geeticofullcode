import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classes from './HeaderSeller.module.css';
import Toggler from '../../components/UI/Toggler/Toggler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import SellerBackendMobNavItems from '../../components/SellerBackendMobNavItems/SellerBackendMobNavItems';
import { authLogOut } from '../../store/actions/auth';
import Logo from '../../shared/images/minimalist-01.png';
import SellerBackendNavigationItems from '../SellerBackendNavigationItems/SellerBackendNavigationItems';
import Notifications from '../Notifications/Notifications';
class HeaderSeller extends Component {
  state = {
    isToggled: false,
    showNotificationDesktop: false
  };

  componentWillMount() {
    document.addEventListener('mousedown', this.closeNavDesktop);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeNavDesktop);
  }
  closeNavDesktop = e => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }
    this.setState({
      // showDropDown: false,
      // showNavDesktop: false,
      showNotificationDesktop: false
    });
  };
  onClickedHandler = navItem => {};

  toggledHandler = () => {
    this.setState(pS => {
      return {
        isToggled: !pS.isToggled
      };
    });
  };
  logoutHandler = () => {
    this.props.onLogout();
    this.props.history.push('/sellerpage');
  };
  showNotificationHandler = () => {
    this.setState(prevState => {
      return {
        showNotificationDesktop: !prevState.showNotificationDesktop
      };
    });
  };
  goToNotificationHandler = () => {
    this.props.history.push('/sellerpage/all-notifications');
  };

  render() {
    return (
      <div className={classes.HeaderSeller}>
        <div
          className={
            !this.state.isToggled
              ? classes.SellerBackendMobNavItemsCont
              : [classes.SellerBackendMobNavItemsCont, classes.zoomNav].join(
                  ' '
                )
          }
        >
          <SellerBackendMobNavItems
            navItems={this.props.navItems}
            logoutHandler={this.logoutHandler}
            goToNotification={this.goToNotificationHandler}
          />
        </div>
        <div
          className={
            !this.state.isToggled
              ? classes.AnimEffect1
              : [
                  classes.AnimEffect1,
                  classes.ScaleBig,
                  classes.mobileOnly
                ].join(' ')
          }
        />

        {this.props.signupHeader ? (
          <React.Fragment>
            <Link to='/sellerpage'>
              <div className={classes.Header}>
                <img width='10px' src={Logo} />
              </div>
            </Link>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to='/' className={classes.HeaderLink}>
              <div className={classes.Header}>
                <img width='50px' src={Logo} />
              </div>
            </Link>
            <div className={[classes.desktopOnly, classes.NavHigher].join(' ')}>
              <div className={classes.backendNavItems}>
                <SellerBackendNavigationItems
                  navItems={this.props.navItems}
                  clicked={this.onClickedHandler}
                />
              </div>
            </div>

            <div
              className={[classes.TogglerCont, classes.higherIndex].join(' ')}
            >
              {this.props.notificationCount > 0 ? (
                <span className={classes.circularNotCount}>
                  {this.props.notificationCount}
                </span>
              ) : null}
              <Toggler
                color='#6ce001'
                background='#6ce001'
                clicked={this.toggledHandler}
                isToggled={this.state.isToggled}
              />
            </div>

            <div
              ref={node => (this.node = node)}
              className={[classes.Notifications, classes.desktopOnly].join(' ')}
            >
              <FontAwesomeIcon
                icon={faBell}
                style={{
                  color: this.state.showNotificationDesktop ? '#6ce001' : '#bbb'
                }}
              />{' '}
              <span
                className={classes.notificationSpan}
                onClick={this.showNotificationHandler}
              >
                Notifications ({this.props.notificationCount})
              </span>
              <Notifications
                show={this.state.showNotificationDesktop}
                notifications={this.props.notifications}
              />
            </div>
            <div
              className={[classes.ProfileDetails, classes.desktopOnly].join(
                ' '
              )}
            >
              {/* <span> */}
              <img
                className={classes.avatar}
                src={this.props.avatar}
                alt='avatar'
              />
              {/* </span> */}
              <span className={classes.Logout} onClick={this.logoutHandler}>
                Logout
              </span>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    authCheck: state.auth.loading,
    fullName: state.auth.fullName,
    email: state.auth.email,
    avatar: state.auth.avatar,
    notificationCount: state.notification.notificationCount,
    notifications: state.notification.notifications
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogOut())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeaderSeller)
);
