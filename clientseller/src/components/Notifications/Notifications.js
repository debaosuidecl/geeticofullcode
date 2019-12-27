import React from 'react';
import classes from './Notifications.module.css';
import App from '../../App';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';
// import Category from '../../Models/Category';
// import { authLogOut } from '../../store/actions/auth';
import { withRouter } from 'react-router';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotificationItem from '../NotificationItem/NotificationItem';

const NotificationDropDown = props => {
  return (
    <div
      className={classes.NotificationDropDownCont}
      style={{ display: props.show ? 'block' : 'none' }}
    >
      <div className={classes['arrow-up']}></div>
      <div className={classes.NotificationDropDown}>
        <div className={classes.Header}>
          <h4>Notifications</h4>
        </div>
        <div className={classes.Body} {...props}>
          {props.notificationLoading ? (
            <p>Loading...</p>
          ) : Array.isArray(props.notifications) &&
            props.notifications.length <= 0 ? (
            <div className={classes.NoNotificationCont}>
              <FontAwesomeIcon icon={faBellSlash} />
              <p>No Notifications</p>
            </div>
          ) : (
            props.notifications.length > 0 &&
            props.notifications.map((n, i) => (
              <NotificationItem key={n._id} item={n} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
NotificationDropDown.propTypes = {
  show: PropTypes.bool
};

const mapStateToProps = state => {
  // console.log(state, 'noteee');
  return {
    // itemCount: state.cart.itemCount,
    // isAuthenticated: state.auth.token !== null,
    fullname: state.auth.fullName,
    avatar: state.auth.avatar,
    notificationLoading: state.notification.loading

    // showAuthModal: state.auth.showAuthModal
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // onlogout: () => dispatch(authLogOut())
    // onFetchCartItems: () => dispatch(fetchAllCartItems()),
    // onToggleCartPreview: () => dispatch(showCartPreview())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NotificationDropDown));
