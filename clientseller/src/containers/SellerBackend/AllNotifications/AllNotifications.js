import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { notificationGet } from '../../../store/actions/notifications';
import classes from './AllNotifications.module.css';
import NotificationItem from '../../../components/NotificationItem/NotificationItem';

class AllNotifications extends Component {
  componentDidMount() {
    this.props.notGet();
  }
  render() {
    return (
      <SellerBackendLayout>
        <h2 className={classes.header}>My notifications</h2>
        <div>
          {this.props.notificationLoading ? (
            <p>Loading...</p>
          ) : Array.isArray(this.props.notifications) &&
            this.props.notifications.length <= 0 ? (
            <div className={classes.NoNotificationCont}>
              <FontAwesomeIcon icon={faBellSlash} />
              <p>No Notifications</p>
            </div>
          ) : (
            this.props.notifications.length > 0 &&
            this.props.notifications.map((n, i) => (
              <NotificationItem key={n._id} item={n} />
            ))
          )}
        </div>
      </SellerBackendLayout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    notGet: () => dispatch(notificationGet())
  };
};

const mapStateToProps = state => {
  return {
    // isAuthenticated: state.auth.token !== null,
    // authCheck: state.auth.loading,
    // fullName: state.auth.fullName,
    // email: state.auth.email,
    // avatar: state.auth.avatar,
    notificationCount: state.notification.notificationCount,
    notifications: state.notification.notifications,
    notificationLoading: state.notification.loading
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AllNotifications));
