import React, { Component } from 'react';

export class VerificationImageUpload extends Component {
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
    return <div></div>;
  }
}

export default VerificationImageUpload;
