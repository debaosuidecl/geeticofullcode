import React, { Component } from 'react';
import classes from "./VerificationImageUpload.module.css"
import Modal from '../UI/Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
export class VerificationImageUpload extends Component {


  state = {
    loading: true,
    bankDetails: null,
    orderDetails: null,
    confirmPaymentInitiated: false,
    fileName: null,
    formValidity: false,
    animateFileIcon: false,
    file: null
  };


  
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

  modalGenerator = () => (
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
  render() {
    return this.modalGenerator();
  }
}

export default VerificationImageUpload;
