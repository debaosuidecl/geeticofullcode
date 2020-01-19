import React from 'react';
import classes from './DesktopDropDown.module.css';
import App from '../../App';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Category from '../../Models/Category';
import { authLogOut } from '../../store/actions/auth';
import { withRouter } from 'react-router';
// import { Link } from 'react-router-dom';

const DesktopDropDown = props => {
  console.log(props, 'from d drop');
  return (
    <div
      ref={props.customReference}
      className={classes.DesktopDropDownCont}
      style={{ display: props.show ? 'block' : 'none' }}
    >
      <div className={classes['arrow-up']}></div>
      <div className={classes.DesktopDropDown}>
        <div className={classes.Header}>
          {props.isAuthenticated ? (
            <div className={classes.avatarAndName}>
              <div className={classes.avatarCont}>
                <img
                  alt='avatar'
                  width='40px'
                  src={props.avatar}
                  className={classes.avatar}
                />
              </div>

              <div className={classes.fullName}>
                <p> Hi {props.fullname.split(' ')[0]}</p>
              </div>
            </div>
          ) : (
            <div className={classes.welcomeNoLogIn}>
              <p> Welcome to Geetico</p>
            </div>
          )}
        </div>
        <div className={classes.Body} {...props}>
          {/* <h4>
            Notifications <span>(4)</span>
          </h4> */}
          <h4 onClick={() => props.history.push('/')}>Home</h4>

          {props.isAuthenticated ? (
            <h4
              onClick={() => {
                // this.props.onLogout();
                props.history.push('/orders');
              }}
            >
              Track My Orders
            </h4>
          ) : null}
          <h4>Categories</h4>
          {App.allowedCategories.map((a, i) => {
            let icon = new Category(a);
            return (
              <div className={classes.category} key={i}>
                {' '}
                <FontAwesomeIcon color='#bbb' icon={icon.iconReturn()} />
                <a href={`/category/${a}`}>{a}</a>
              </div>
            );
          })}
          {props.isAuthenticated ? (
            <div className={classes.logoutCont}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <h4
                onClick={() => {
                  props.onLogout();
                  // window.location.href = '/';
                }}
              >
                Logout
              </h4>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    // itemCount: state.cart.itemCount,
    isAuthenticated: state.auth.token !== null,
    fullname: state.auth.fullName,
    avatar: state.auth.avatar

    // showAuthModal: state.auth.showAuthModal
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogOut())
    // onFetchCartItems: () => dispatch(fetchAllCartItems()),
    // onToggleCartPreview: () => dispatch(showCartPreview())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DesktopDropDown));
