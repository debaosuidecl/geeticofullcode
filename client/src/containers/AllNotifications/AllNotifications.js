import React, { Component } from 'react';
import Layout from '../../components/UI/Layout/Layout';
import axios from 'axios';
import { withRouter, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { notificationGet } from '../../store/actions/notifications';
import classes from './AllNotifications.module.css';
import NotificationItem from '../../components/NotificationItem/NotificationItem';
import App from '../../App';
import InfiniteScroll from 'react-infinite-scroll-component';

export class AllNotifications extends Component {
  state = {
    page: 2,
    notifications: [],
    hasMore: true,
    loading: true
  };
  componentDidMount() {
    // this.props.notGet();
    this.initFetch();
  }
  initFetch = async status => {
    const token = localStorage.getItem('token');

    if (!token) {
      return console.log('no access');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    let url = `${App.domain}api/notifications/1?getCount=true&buyer=true`;
    let firstresp = await axios.get(url, config);
    console.log(firstresp.data, 'na the first time be dis');
    this.setState(prevState => {
      return {
        loading: false,
        // page: prevState.page + 1,
        notifications: prevState.notifications.concat(
          firstresp.data.notifications
        ),
        hasMore: firstresp.data.notifications.length < 50 ? false : true
      };
    });
  };

  fetchMoreData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return console.log('no access');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    let firstresp = await axios.get(
      `${App.domain}api/notifications/${this.state.page}?getCount=true&buyer=true`,
      config
    );
    console.log(firstresp.data);
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
        notifications: prevState.notifications.concat(
          firstresp.data.notifications
        ),
        hasMore: firstresp.data.notifications.length < 50 ? false : true
      };
    });
  };

  getNotificationsHandler = () => {};

  render() {
    console.log(this.state.notifications, 'from render');
    let authRedirect =
      this.props.isAuthenticated && this.props.hasFinishedLoading ? null : !this
          .props.isAuthenticated && this.props.hasFinishedLoading ? (
        <Redirect to={`/?auth=true&redirect=notifications`} />
      ) : null;
    return (
      <Layout>
        {authRedirect}
        <h2 className={classes.header}>My notifications</h2>
        <div className={classes.Body}>
          {this.state.loading ? (
            <p>Loading...</p>
          ) : Array.isArray(this.state.notifications) &&
            this.state.notifications.length <= 0 ? (
            <div className={classes.NoNotificationCont}>
              <FontAwesomeIcon icon={faBellSlash} />
              <p>No Notifications</p>
            </div>
          ) : (
            <div className={classes.Body}>
              <InfiniteScroll
                dataLength={this.state.notifications.length}
                next={this.fetchMoreData}
                hasMore={this.state.hasMore}
                loader={
                  <div style={{ textAlign: 'center' }}>
                    {/* //   <SpinnerTwo /> */}
                    ...
                  </div>
                }
                endMessage={
                  <p style={{ textAlign: 'center', fontWeight: 100 }}>
                    <b>end of Notifications</b>
                  </p>
                }
              >
                <div className={classes.Container}>
                  {/* <div className={classes.Or}></div> */}
                  {this.state.notifications.length > 0 &&
                    this.state.notifications.map((n, i) => {
                      return <NotificationItem key={n._id} item={n} />;
                    })}
                </div>
              </InfiniteScroll>
            </div>
          )}
        </div>
      </Layout>
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
    isAuthenticated: state.auth.token !== null,
    authCheck: state.auth.authCheckLoading,
    hasFinishedLoading: state.auth.firstLoad === 1,
    notificationCount: state.notification.notificationCount,
    notifications: state.notification.notifications,
    notificationLoading: state.notification.loading
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AllNotifications));
