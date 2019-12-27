import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './Customers.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import App from '../../../App';
import CustomerItem from '../../../components/CustomerItem/CustomerItem';

export class AllNotifications extends Component {
  state = {
    customers: [],
    loading: true,
    page: 2
  };
  componentDidMount() {
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
    let firstresp = await axios.get(`${App.domain}api/customers/1`, config);
    console.log(firstresp.data);

    this.setState(prevState => {
      return {
        loading: false,
        // page: prevState.page + 1,
        customers: prevState.customers.concat(firstresp.data),
        hasMore: firstresp.data.length > 0
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
      `${App.domain}api/customers/${this.state.page}`,
      config
    );
    console.log(firstresp.data);
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
        customers: prevState.customers.concat(firstresp.data),
        hasMore: firstresp.data.length > 0
      };
    });
  };

  render() {
    return (
      <SellerBackendLayout>
        <h2 className={classes.header}>My Customers</h2>
        {this.state.loading === false && this.state.customers.length <= 0 ? (
          <p className={classes.NoOrders}>There are no Customers</p>
        ) : null}
        <InfiniteScroll
          dataLength={this.state.customers.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<div style={{ textAlign: 'center' }}>...</div>}
          endMessage={
            <p style={{ textAlign: 'center', fontWeight: 100 }}>
              <b>End of customer list</b>
            </p>
          }
        >
          <div className={classes.Container}>
            {this.state.customers.length > 0 &&
              this.state.customers.map((customer, i) => {
                return <CustomerItem c={customer} />;
              })}
          </div>
        </InfiniteScroll>
      </SellerBackendLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    notificationCount: state.notification.notificationCount,
    notifications: state.notification.notifications,
    notificationLoading: state.notification.loading
  };
};
export default connect(mapStateToProps, null)(withRouter(AllNotifications));
