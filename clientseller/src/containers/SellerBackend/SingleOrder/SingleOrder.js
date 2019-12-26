import React, { Component } from 'react';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './SingleOrder.module.css';
import axios from 'axios';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import App from '../../../App';
import { withRouter } from 'react-router';
import OrderCard from '../../../components/OrderCard/OrderCard';
import Backdrop from '../../../components/UI/Backdrop/Backdrop';

export class SingleOrder extends Component {
  state = {
    order: null,
    statusChangeLoader: false,
    loading: true
  };
  componentDidMount() {
    console.log(this.props, 'from single order');
    this.fetchOrderData();
    this.changeNotification();
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
        `${App.domain}api/notifications/changesellertoread/${this.props.match.params.orderId}`,
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

      // setLoadingHandler();
    }
  };
  setLoadingHandler = () => {
    this.setState(p => {
      return {
        statusChangeLoader: !p.statusChangeLoader
      };
    });
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
    // let display = <Spinner />;
    let display =
      this.state.loading && this.state.order === null ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <OrderCard
            // key={i}
            setLoadingHandler={this.setLoadingHandler}
            order={this.state.order}
            isForcedCollapse={true}
            setLoadingHandler={this.setLoadingHandler}
          />
          {this.state.order.verificationImage ? (
            <div className={classes.VerificationInformation}>
              <h2>Verification image</h2>
              <div className={classes.verificationImageCont}>
                <img
                  src={`https://seller.geetico.com/test-public/${this.state.order.verificationImage}`}
                  alt=''
                />
              </div>
            </div>
          ) : null}
        </React.Fragment>
      );
    return (
      <SellerBackendLayout>
        {this.state.statusChangeLoader ? loadingStage : null}
        <div className={classes.SingleOrder}>{display}</div>
      </SellerBackendLayout>
    );
  }
}

export default withRouter(SingleOrder);
