import React, { Component } from 'react';
import Layout from '../../components/UI/Layout/Layout';
import classes from './CheckEmailForVerification.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
export class CheckEmailForVerification extends Component {
  render() {
    return (
      <Layout hideFooter>
        <div className={classes.CheckEmailForVerification}>
          <div className={classes.Email}>
            <FontAwesomeIcon icon={faEnvelopeOpen} />
          </div>
          <h2>Thanks for opening an account with Geetico!</h2>
          <p>
            Please Check Your Email and simply click on the Verification Link
            sent to you and begin your shopping experience with us.{' '}
          </p>
        </div>
      </Layout>
    );
  }
}

export default CheckEmailForVerification;
