import React, { Component } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import App from '../../App';
import Spinner from '../../components/UI/Spinner/Spinner';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import classes from './OrderSuccessRedirect.module.css';
// import Spinner from '../../components/UI/Spinner/Spinner';

class OrderSuccessRedirect extends Component {
  componentDidMount() {
    if (
      queryString.parse(this.props.location.search) &&
      queryString.parse(this.props.location.search).reference
    ) {
      let ref = queryString.parse(this.props.location.search).reference;
      // console.log(ref);
      const token = localStorage.getItem('token');
      if (!token) {
        // return this.props.onAuthLogout();
        return console.log('No authorization');
      }
      let config = {
        headers: {
          'x-auth-token': token
        }
      };
      // this.props.history.push('/checkout');
      // let response;
      axios
        .get(
          `${App.domain}api/users/paystack/callback?reference=${ref}`,
          config
        )
        .then(res => {
          // console.log(res.data);
          if (res.data.success === true) {
            localStorage.removeItem('cart-sama');
            // response = res.data.order._id;
            this.props.history.push(
              `/orders?orderId=${res.data.order.transactionId}`
            );
          }
        })
        .catch(e => {
          if (e.response === undefined) return console.log(e);
          // console.log(e.response);
          if (
            e.response.data.msg ===
            'Attempting to verify the same transaction twice'
          ) {
            this.props.history.push(
              `/orders?orderId=${e.response.data.data.transactionId}`
            );
          }
        });
      // this.props.onSetAuthModalToTrue();
    }
  }
  render() {
    let loadingStage = (
      <div className=''>
        <Backdrop forceWhite show={true} />

        <div className={classes.spinnerCont}>
          <Spinner />
        </div>
      </div>
    );
    return (
      <div>
        {/* <Spinner /> */}
        {loadingStage}
      </div>
    );
  }
}

export default OrderSuccessRedirect;
