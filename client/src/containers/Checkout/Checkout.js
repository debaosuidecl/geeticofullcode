import React, { Component } from 'react';
import Layout from '../../components/UI/Layout/Layout';
import Modal from '../../components/UI/Modal/Modal';
import classes from './Checkout.module.css';
import { connect } from 'react-redux';
import CustomerDetailComponent from '../../components/CustomerDetailComponent/CustomerDetailComponent';
import { fetchAllCartItems } from '../../store/actions/cart';
import { Redirect, Link } from 'react-router-dom';
import { authLogOut, authSuccess } from '../../store/actions/auth';
import paystackImage from '../../shared/images/pay_paystack.png';
import paystackLogo from '../../shared/images/paystackLogo.jpg';
import Button from '../../components/UI/Button/Button';
import axios from 'axios';
import App from '../../App';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Spinner from '../../components/UI/Spinner/Spinner';

class Checkout extends Component {
  state = {
    directSelected: true,
    payStackSelected: false,
    state: 'Lagos',
    city: '',
    suite: '',
    street: '',
    phone: '',
    company: '',
    orderNote: '',
    loading: false,
    errors: [],
    hitotsunagi: '',
    startDate: '',
    time: ''
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    const token = localStorage.getItem('token');

    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    let url = `${App.domain}api/userauth/`;
    axios
      .get(url, config)
      .then(response => {
        const { city, suite, street, phone, company } = response.data;

        this.setState({
          city: city ? city : '',
          suite: suite ? suite : '',
          street: street ? street : '',
          phone: phone ? phone : '',
          company: company ? company : ''
        });

        // console.log(response.data);
      })

      .catch(error => {
        if (error.response && error.response.data.msg) {
          this.props.history.push('/');
        }
      });
    this.props.onFetchCartItems();
  }
  changeOrderSelect = control => {
    switch (control) {
      case 'directSelected':
        return this.setState({ directSelected: true, payStackSelected: false });
      default:
        return this.setState({ directSelected: false, payStackSelected: true });
    }
  };
  changeHandler = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onPlaceOrder = () => {
    this.setState({ errors: [], loading: true });
    const {
      state,
      city,
      suite,
      street,
      phone,
      company,
      orderNote,
      startDate,
      time
    } = this.state;
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

      let url = `${App.domain}api/users/userOrderUpdate`;

      let cart = localStorage.getItem('cart-sama');
      if (cart === null) {
        this.setState({ loading: false });
        this.props.history.push('/');
      }
      let cartToJson = JSON.parse(cart);
      let data = {
        state,
        city,
        suite,
        street,
        phone,
        company,
        orderNote,
        cartToJson,
        dateOfDelivery: startDate,
        timeOfDelivery: time,
        directSelected: this.state.directSelected
      };
      axios
        .post(url, data, config)
        .then(result => {
          if (result.data.url) {
            this.setState({ loading: false, hitotsunagi: result.data });
          } else {
            console.log(result.data);
            this.setState({ loading: false });
          }
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
              if (err.response.data.errors) {
                // document.querySelector('[href="#TNV"]').click();
                window.scrollTo(0, 0);
                this.setState({ errors: err.response.data.errors });
              }
            }
          }
        });
    }
  };
  setStartDate = startDate => {
    // console.log(startDate);
    this.setState({ startDate });
  };
  removeHitotsuNagi = () => {
    this.setState(p => {
      return {
        hitotsunagi: null
      };
    });
  };
  render() {
    let authRedirect = this.props.isAuthenticated ? null : (
      <Redirect to={`/?auth=true&redirect=checkout`} />
    );

    let subTotal =
      this.props.cart &&
      this.props.cart !== 0 &&
      Array.isArray(this.props.cart) &&
      this.props.cart
        .map(c => [c.price, c.quantity])
        .reduce((pv, cv) => pv + cv[0] * cv[1], 0);
    let errors =
      this.state.errors.length > 0 &&
      this.state.errors.map((e, i) => {
        return (
          <div key={i} className={classes.Error}>
            <p>{e.msg}</p>
          </div>
        );
      });
    let shippingCost;
    if (this.state.directSelected) {
      if (subTotal < 30000) {
        shippingCost = 599;
      } else {
        shippingCost = 999;
      }
    } else {
      if (subTotal < 30000) {
        shippingCost = 999;
      } else if (subTotal < 80000) {
        shippingCost = 1999;
      } else {
        shippingCost = 2999;
      }
    }
    let hitotsunagi = (
      <Modal
        removeModal={() => this.removeHitotsuNagi()}
        show={this.state.hitotsunagi}
      >
        {this.state.hitotsunagi ? (
          <div className={classes.continueWithPaystack}>
            <img src={paystackLogo} width='120px' alt='' />
            <div className={classes.continueCont}>
              <Button
                clicked={() => {
                  document.querySelector('#hitotsunagi').click();
                  this.setState({ loading: false });
                }}
                btnType='Geetico'
              >
                Continue with Paystack
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    );
    let loadingStage = (
      <div className=''>
        <Backdrop forceWhite show={true} />

        <div className={classes.spinnerCont}>
          <Spinner />
        </div>
      </div>
    );
    // console.log(this.props.cart, 'cart');
    return (
      <Layout hideFooter hideCheckoutDrop>
        {this.props.cart === 0 ? loadingStage : null}
        {this.state.loading ? loadingStage : null}
        <a
          href={this.state.hitotsunagi ? this.state.hitotsunagi.url : '#'}
          id='hitotsunagi'
        >
          {' '}
        </a>
        <a href='#TNV'> </a>
        {authRedirect}
        {hitotsunagi}
        <div className={classes.Navigator}>
          <Link to='/'>Home </Link> ><Link to='/cart'> Cart </Link> >
          <Link to='/checkout'> Checkout </Link>
          <div className={classes.Checkout}>
            {/* <h1>Checkout</h1> */}
            <div className={classes.Left}>
              <div className={classes.CheckoutContent}>
                <div className={classes.CheckoutHeader}>
                  <h2>Secure checkout</h2>
                </div>
                {errors}
                <CustomerDetailComponent
                  state={this.state.state}
                  city={this.state.city}
                  suite={this.state.suite}
                  street={this.state.street}
                  phone={this.state.phone}
                  company={this.state.company}
                  orderNote={this.state.orderNote}
                  changeHandler={this.changeHandler}
                  startDate={this.state.startDate}
                  setStartDate={this.setStartDate}
                  time={this.state.time}
                />
              </div>
            </div>
            <div className={classes.Right}>
              <div className={classes.SummaryCont}>
                <div className={classes.CheckoutHeader}>
                  <h2>Your Orders</h2>
                </div>
                <div className={classes.RightHeading}>
                  <p className={classes.titleNoBold}>Product</p>
                  <p className={classes.value}>Total</p>
                </div>
                {this.props.cart &&
                  Array.isArray(this.props.cart) &&
                  this.props.cart.map(c => {
                    return (
                      <div className={classes.RightHeading} key={c._id}>
                        <p className={classes.titleNoBold}>
                          {c.productName} X {c.quantity}
                        </p>
                        <p className={classes.value}>
                          &#x20A6;{' '}
                          {parseFloat(
                            (c.price * c.quantity).toString().replace(/,/g, '')
                          )
                            .toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </p>
                      </div>
                    );
                  })}

                <div className={classes.RightHeading}>
                  <p className={classes.titleNoBold}>Sub total</p>
                  <p className={classes.value}>
                    &#x20A6;{' '}
                    {parseFloat(subTotal.toString().replace(/,/g, ''))
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
                <div className={classes.RightHeading}>
                  <p className={classes.titleNoBold}>Shipping Cost</p>
                  <p className={classes.value}>
                    &#x20A6;{' '}
                    {parseFloat(shippingCost.toString().replace(/,/g, ''))
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
                <div className={classes.RightHeading}>
                  <p className={classes.titleLarge}>Total</p>
                  <p className={classes.valueLarge}>
                    &#x20A6;{' '}
                    {parseFloat(
                      (shippingCost + subTotal).toString().replace(/,/g, '')
                    )
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
              </div>

              {/*  */}
              <div className={classes.OrderType}>
                <div className={classes.OrderTypeMajor}>
                  <div className={classes.OrderTypeCont}>
                    <h4
                      onClick={() => this.changeOrderSelect('directSelected')}
                      className={
                        this.state.directSelected ? classes.selectedText : null
                      }
                    >
                      Direct Payment{' '}
                    </h4>
                  </div>
                  <div className={classes.OrderTypeCont}>
                    <h4
                      onClick={() => this.changeOrderSelect('payStackSelected')}
                      className={
                        this.state.payStackSelected
                          ? classes.selectedText
                          : null
                      }
                    >
                      Pay with Paystack{' '}
                    </h4>
                    <img
                      src={paystackImage}
                      // style={{ marginLeft: 50 }}
                      width='120px'
                      alt='paystack'
                    />
                  </div>
                  <div className={classes.OrderTypeDesc}>
                    <p style={{ opacity: this.state.directSelected ? 1 : 0 }}>
                      PAY AS LOW AS &#x20A6;599 FOR SHIPPING & HANDLING. Please
                      use your Order ID as the payment reference. Your order
                      won’t be shipped until the funds have cleared in our
                      account.
                    </p>
                    <p style={{ opacity: this.state.payStackSelected ? 1 : 0 }}>
                      Make payment using VISA QR or your debit and credit cards
                      (both local and International)
                    </p>
                  </div>
                  {/* <div className={classes.OrderTypeDesc}></div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.PlaceOrderCont}>
          <Button btnType='Geetico' clicked={this.onPlaceOrder}>
            Proceed To Payment - (&#x20A6;{' '}
            {parseFloat((shippingCost + subTotal).toString().replace(/,/g, ''))
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            )
          </Button>
        </div>
      </Layout>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onFetchCartItems: () => dispatch(fetchAllCartItems()),

    onAuthLogout: () => dispatch(authLogOut()),
    onAuthSuccess: () => dispatch(authSuccess())
    // onAuthFail: ()=>dispatch(aut)
  };
};

const mapStateToProps = state => {
  // console.log(state.auth);
  return {
    cart: state.cart.cartItems,
    isAuthenticated: state.auth.token !== null
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checkout);
