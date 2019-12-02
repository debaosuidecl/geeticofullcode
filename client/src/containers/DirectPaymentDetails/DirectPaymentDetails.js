import React, { Component } from 'react';
import App from '../../App';
import axios from 'axios';
import Button from '../../components/UI/Button/Button';
import Layout from '../../components/UI/Layout/Layout';
import Modal from '../../components/UI/Modal/Modal';
import classes from './DirectPaymentDetails.module.css';
export class DirectPaymentDetails extends Component {
  state = {
    loading: true,
    bankDetails: null,
    orderDetails: null,
    confirmPaymentInitiated: false
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

      let url = `${App.domain}api/users/directPaymentOrder?transactionId=${this.props.match.params.transactionId}`;

      // let cart = localStorage.getItem('cart-sama');
      // // if (cart === null) {
      // //   this.setState({ loading: false });
      // //   this.props.history.push('/');
      // // }

      axios
        .get(url, config)
        .then(result => {
          console.log(result.data);
          localStorage.removeItem('cart-sama');
          this.setState({
            bankDetails: result.data.bankDetails,
            orderDetails: result.data._doc.amount / 100
          });
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

  modalGenerator = () => {
    return (
      <Modal
        removeModal={() => this.setState({ confirmPaymentInitiated: false })}
        show={this.state.confirmPaymentInitiated}
      >
        blah
      </Modal>
    );
  };

  render() {
    return (
      <Layout hideFooter hideCheckoutDrop>
        <div className={classes.DirectPaymentDetails}>
          {this.modalGenerator()}
          <div
            className={classes.CardVerificationDetails}
            style={{
              transform: this.state.bankDetails
                ? 'rotateX(0)'
                : 'rotateX(90deg)'
            }}
          >
            <h2 className={classes.header}>Thank You for shopping Geetico.</h2>
            <h2 className={classes.orderDetailHeader}>ORDER DETAILS</h2>

            <h2 className={classes.header}>
              TOTAL:{' '}
              <span style={{ color: '#6ce001' }}>
                &#8358;
                {this.state.orderDetails
                  ? parseFloat(
                      this.state.orderDetails.toString().replace(/,/g, '')
                    )
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : null}
              </span>
            </h2>
            <div>
              {/* <p >Here are our account details</p> */}
              <div className={classes.BankDetailsCont}>
                <p>
                  {' '}
                  {this.state.bankDetails
                    ? 'Bank: ' + this.state.bankDetails.bank
                    : null}
                </p>
                <p>
                  {' '}
                  {this.state.bankDetails
                    ? 'Account Name: ' + this.state.bankDetails.accountNumber
                    : null}
                </p>
                <p>
                  {' '}
                  {this.state.bankDetails
                    ? 'Account Name: ' + this.state.bankDetails.accountName
                    : null}
                </p>

                <p>Confirm payment once Transfer is Done</p>
              </div>
              <div style={{ textAlign: 'center', margin: '20px auto' }}>
                <Button
                  btnType='Geetico'
                  clicked={() =>
                    this.setState({ confirmPaymentInitiated: true })
                  }
                >
                  Proceed to payment confirmation
                </Button>
              </div>
            </div>
          </div>
          {/* <div
            className={classes.CardVerificationDetails}
            
          ></div> */}
        </div>
      </Layout>
    );
  }
}

export default DirectPaymentDetails;
