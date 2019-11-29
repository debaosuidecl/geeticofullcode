import React, { Component } from 'react';
import App from '../../App';
import axios from 'axios';
export class DirectPaymentDetails extends Component {
  state = {
    loading: true
  };
  componentDidMount() {
    console.log(this.props.match.params.transactionId);
    const token = localStorage.getItem('token');
    if (!token) {
      this.setState({ loading: false });
      this.props.onAuthLogout();
    } else {
      let config = {
        headers: {
          'x-auth-token': token
        }
      };

      let url = `${App.domain}api/users/directPaymentOrder`;

      let cart = localStorage.getItem('cart-sama');
      if (cart === null) {
        this.setState({ loading: false });
        this.props.history.push('/');
      }

      axios
        .get(url, config)
        .then(result => {
          console.log(result.data);
          // console.log(result.data);
        })
        .catch(err => {
          this.setState({ loading: false });

          // console.log(err.response);
          if (err.response) {
            if (err.response.data) {
              if (err.response.data.msg === 'Token is not valid') {
                this.props.onAuthLogout();
              }
            }
            if (err.response.noDirectPayment) {
              this.props.history.push('/');
            }
          }
        });
    }
  }
  render() {
    return <div></div>;
  }
}

export default DirectPaymentDetails;
