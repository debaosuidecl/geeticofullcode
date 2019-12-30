import React, { Component } from 'react';
import App from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
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
    confirmPaymentInitiated: false,
    fileName: null,
    formValidity: false,
    animateFileIcon: false,
    file: null,
    verificationRejected: false
  };
  componentDidMount() {
    window.scrollTo(0, 0);

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

      axios
        .get(url, config)
        .then(result => {
          console.log(result.data);
          localStorage.removeItem('cart-sama');
          this.setState({
            bankDetails: result.data.bankDetails,
            orderDetails: result.data._doc.amount / 100,
            verificationRejected:
              result.data._doc.status === 'verification rejected'
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
            console.log(err.response);
            if (err.response.data.noDirectPayment) {
              this.props.history.push('/');
            }
          }
        });
    }
  }

  confirmHandler = () => {
    this.setState({
      loading: true
    });
    console.log(this.state.file);
    let formData = new FormData();
    formData.append('myImages', this.state.file);
    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'x-auth-token': token
      }
    };
    axios
      .post(
        `${App.domain}api/users/verification-image/${this.props.match.params.transactionId}`,
        formData,
        config
      )
      .then(response => {
        console.log(response);
        this.setState({
          loading: false
        });
        this.props.history.push(`/orders?orderId=${response.data.orderId}`);
        // alert('The file is successfully uploaded');
        // dispatch(productAdd(userId, productInfo));
      })
      .catch(error => {
        console.log(error);
        // dispatch(productAddFail());
        alert('Critical Failure in Adding Product');
      });
  };

  handleImageChange = e => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file);
    // return;
    reader.onprogress = data => {
      if (data.lengthComputable) {
      }
    };
    reader.onloadend = () => {
      this.setState(prevState => {
        return {
          file,
          fileName: file.name,
          animateFileIcon: true,
          formValidity: true
        };
      });
    };

    if (file && file.type.match('image.*')) {
      reader.readAsDataURL(file);
    } else {
      return;
    }
  };

  modalGenerator = () => {
    return (
      <Modal
        removeModal={() => this.setState({ confirmPaymentInitiated: false })}
        show={this.state.confirmPaymentInitiated}
      >
        <div className={classes.InputCont}>
          <h5>Click on the icon below to upload proof of payment</h5>
          <label htmlFor='directPaymentInput'>
            <FontAwesomeIcon
              color='green'
              size='10x'
              icon={faFileUpload}
              className={this.state.animateFileIcon ? classes.Rotate : ''}
            />
          </label>
          <input
            onChange={this.handleImageChange}
            id='directPaymentInput'
            className={classes.inputfile}
            type='file'
            accept='image/jpeg, image/png'
          />
          {this.state.fileName ? <h5>{this.state.fileName}</h5> : null}
          <div className={classes.ConfirmImage}>
            <button
              onClick={this.confirmHandler}
              disabled={!this.state.formValidity}
            >
              Confirm Proof of Payment
            </button>
          </div>
        </div>
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
            {!this.state.verificationRejected ? (
              <React.Fragment>
                <h2 className={classes.header}>
                  Thank You for shopping Geetico.
                </h2>
                <h2 className={classes.orderDetailHeader}>ORDER DETAILS</h2>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h2 className={classes.rejected}>
                  The Verification image you submitted was rejected. Please
                  upload a new image and ensure it clearly shows the amount
                  transfered - preferably a screenshot
                </h2>
              </React.Fragment>
            )}

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
        </div>
      </Layout>
    );
  }
}

export default DirectPaymentDetails;
