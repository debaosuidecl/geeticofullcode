import React, { Component } from 'react';
import Layout from '../../components/UI/Layout/Layout';
import OrderCard from '../../components/OrderCard/OrderCard';
import App from '../../App';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from 'axios';
import classes from './SingleOrder.module.css';

export class SingleOrder extends Component {
  state = {
    order: null,
    loading: true
  };
  componentDidMount() {
    this.fetchOrderData();
    this.changeNotification();
    window.scrollTo(0, 0);
  }
  changeNotification = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return console.log('no access');
      }
      let config = {
        headers: {
          'x-auth-token': token
        }
      };
      const result = await axios.get(
        `${App.domain}api/notifications/changesellertoread/${this.props.match.params.orderId}?buyer=true`,
        config
      );
      console.log(result.data);
      if (result.data === 'success') {
        console.log('updated');
      }
    } catch (error) {}
  };
  fetchOrderData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return console.log('no access');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };

    try {
      let firstresp = await axios.get(
        `${App.domain}api/userorders/single/${this.props.match.params.orderId}`,

        config
      );

      this.setState({ loading: false, order: firstresp.data });
      console.log(firstresp, 'single Order');

      // setLoadingHandler();
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 500) {
          this.setState({ loading: false, order: 0 });
        }
      }
      // setLoadingHandler();
    }
  };
  render() {
    // let display = <Spinner />;
    let display =
      this.state.order === 0 && this.state.loading === false ? (
        <p className={classes.NotFound}>Sorry Order was not found</p>
      ) : this.state.loading && this.state.order === null ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <Spinner />{' '}
        </div>
      ) : (
        <div className={classes.SingleOrder}>
          <OrderCard
            // key={i}
            setLoadingHandler={this.setLoadingHandler}
            order={this.state.order}
            isForcedCollapse={true}
          />
        </div>
      );
    return (
      <Layout>
        <div className={classes.SingleOrder}>{display}</div>
        <div className={classes.bToO}>
          <a href='/orders'>Back To Orders</a>
        </div>
      </Layout>
    );
  }
}

export default SingleOrder;
