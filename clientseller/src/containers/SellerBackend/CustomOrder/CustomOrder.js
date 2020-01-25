import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './CustomOrder.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import App from '../../../App';
import CustomerItem from '../../../components/CustomerItem/CustomerItem';
import CustomOrderItem from '../../../components/CustomOrderItem/CustomOrderItem';

class CustomOrder extends Component {
  state = {
    customorders: [],
    loading: true,
    page: 2,
    hasMore: true
  };
  componentDidMount() {
    this.initFetch();
    const token = localStorage.getItem('token');

    if (!token) {
      return console.log('no access');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    axios
      .get(`${App.domain}api/update-custom-to-read-true`)
      .then(res => {
        console.log(res.data);
      })
      .catch(e => console.log(e.response.data));
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
    let firstresp = await axios.get(
      `${App.domain}api/userorders/customorders/1`,
      config
    );
    console.log(firstresp.data);

    this.setState(prevState => {
      return {
        loading: false,
        // page: prevState.page + 1,
        customorders: prevState.customorders.concat(firstresp.data),
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
      `${App.domain}api/userorders/customorders/${this.state.page}`,
      config
    );
    console.log(firstresp.data);
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
        customorders: prevState.customorders.concat(firstresp.data),
        hasMore: firstresp.data.length > 0
      };
    });
  };

  render() {
    return (
      <SellerBackendLayout>
        <h2 className={classes.header}>Custom Orders</h2>
        {this.state.loading === false && this.state.customorders.length <= 0 ? (
          <p className={classes.NoOrders}>There are no Custom orders</p>
        ) : null}

        <InfiniteScroll
          dataLength={this.state.customorders.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<div style={{ textAlign: 'center' }}>...</div>}
          endMessage={
            <p style={{ textAlign: 'center', fontWeight: 100 }}>
              <b>End of Custom order list</b>
            </p>
          }
        >
          <div className={classes.Container}>
            {this.state.customorders.length > 0 &&
              this.state.customorders.map((c, i) => {
                return <CustomOrderItem c={c} />;
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
export default connect(mapStateToProps, null)(withRouter(CustomOrder));
