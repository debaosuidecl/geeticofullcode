import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classes from './HeaderSeller.module.css';
import Toggler from '../../components/UI/Toggler/Toggler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import SellerBackendMobNavItems from '../../components/SellerBackendMobNavItems/SellerBackendMobNavItems';
import { authLogOut } from '../../store/actions/auth';
import Logo from '../../shared/images/minimalist-01.png';
import SellerBackendNavigationItems from '../SellerBackendNavigationItems/SellerBackendNavigationItems';
class HeaderSeller extends Component {
  state = {
    isToggled: false
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
          <SellerBackendMobNavItems navItems={this.props.navItems} />
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
            <Link to='/'>
              <div className={classes.Header}>
                <img width='50px' src={Logo} />
              </div>
            </Link>
            <div className={classes.desktopOnly}>
              <SellerBackendNavigationItems
                navItems={this.props.navItems}
                clicked={this.onClickedHandler}
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
              <span className={classes.dropDown}>
                <FontAwesomeIcon
                  style={{ paddingTop: 7 }}
                  size='2x'
                  icon={faAngleDown}
                />
                <span className={classes.toolTipMore}>
                  <p className={classes.signintext}>
                    Signed in as {this.props.email}
                  </p>
                </span>
                <span className={classes.toolTipExtend}></span>
              </span>
            </div>

            <div
              className={[classes.TogglerCont, classes.higherIndex].join(' ')}
            >
              <Toggler
                color='#6ce001'
                background='#6ce001'
                clicked={this.toggledHandler}
                isToggled={this.state.isToggled}
              />
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
    avatar: state.auth.avatar
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
