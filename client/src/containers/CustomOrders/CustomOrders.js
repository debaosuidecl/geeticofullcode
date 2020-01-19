// import React from 'react';
import classes from './CustomOrders.module.css';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../components/UI/Layout/Layout';
import Button from '../../components/UI/Button/Button';
import { authLogOut } from '../../store/actions/auth';
import App from '../../App';
import axios from 'axios';
import { Redirect, withRouter } from 'react-router';
import Spinner from '../../components/UI/Spinner/Spinner';
import Backdrop from '../../components/UI/Backdrop/Backdrop';

export class CustomOrders extends Component {
  state = {
    productDetails: '',
    loading: false,
    success: false
  };
  submitCustomOrder = () => {
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

      let url = `${App.domain}api/userorders/custom-order-post`;

      // let cart = localStorage.getItem('cart-sama');
      this.setState({ loading: true });
      axios
        .post(url, this.state, config)
        .then(result => {
          console.log('success');
          this.setState({ loading: false, success: true, productDetails: '' });
          if (result.success) {
            console.log(result);
            // this.props.history.push('/?custom=success');
            this.setState({ loading: false });
          }
        })
        .catch(err => {
          console.log(err.response);
          this.setState({ loading: false });
        });
    }
  };
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
      <Layout>
        {!this.props.isAuth ? <Redirect to='/?redirect=custom' /> : null}
        {this.state.loading ? loadingStage : null}
        <div className={classes.CustomOrders}>
          {/* {this.state.productDetails.map(pr)} */}
          <p>
            Please Enter a short description of your custom order and we will be
            in touch with you shortly
          </p>

          <textarea
            placeholder='Please enter a custom product(s) as well as the quantities you require'
            name='productDetails'
            id=''
            onChange={e => {
              this.setState({ [e.target.name]: e.target.value });
            }}
            cols='30'
            rows='10'
          ></textarea>
          <div className={classes.Submit}>
            <Button clicked={this.submitCustomOrder} btnType='Geetico'>
              Submit Custom Order
            </Button>
          </div>
          {this.state.success ? (
            <p className={classes.Success}>
              You've just made custom order and you will be contacted soon
            </p>
          ) : null}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  };
};

// export default CustomOrders
const mapDispatchToProps = dispatch => {
  return {
    onAuthLogout: () => dispatch(authLogOut())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CustomOrders));
