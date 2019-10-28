import React, { Component } from 'react';
import classes from './Cart.module.css';
import Layout from '../../components/UI/Layout/Layout';
import CartItem from '../../components/CartItem/CartItem';
import axios from 'axios';
import SpinnerTwo from '../../components/UI/Spinner2/Spinner2';
import App from '../../App';
import { connect } from 'react-redux';
import { fetchAllCartItems, initiateEmptyCart } from '../../store/actions/cart';
import Button from '../../components/UI/Button/Button';
import {
  toggleAuthModalAction,
  authLogOut,
  authSuccess
} from '../../store/actions/auth';
import { Link } from 'react-router-dom';
export class Cart extends Component {
  state = {
    loading: false,
    cart: 0
    // currentValue: 1
  };
  componentWillMount() {
    this.props.onFetchCartItems();
  }
  checkAuthBeforeCheckout = () => {
    // this.props.checkAuthState();
    this.setState({ loading: true });
    const token = localStorage.getItem('token');

    if (!token) {
      // dispatch(authLogOut());
      this.setState({ loading: false });
      this.props.onAuthLogout();

      // dispatch(authFail(''));
      this.props.onShowAuthModalToggle();
    } else {
      let config = {
        headers: {
          'x-auth-token': token
        }
      };
      let url = `${App.domain}api/userauth`;
      axios
        .get(url, config)
        .then(response => {
          // console.log(response.data);
          // const { email, _id, fullName, avatar } = response.data;
          setTimeout(() => {
            // this.props.onAuthSuccess(token, _id, fullName, email, avatar);
            this.props.history.push('/checkout');
          }, 500);
        })

        .catch(error => {
          // console.log(error.response.data);
          // if (error.response.data.msg) {
          this.setState({ loading: true });
          this.props.onAuthLogout();
          this.props.onShowAuthModalToggle();

          // }
        });
    }
  };
  render() {
    // extract sub total from props
    // console.log(this.props.cart);
    let subTotal =
      0.0 ||
      (this.props.cart &&
        this.props.cart !== 0 &&
        Array.isArray(this.props.cart) &&
        this.props.cart
          .map(c => [c.price, c.quantity])
          .reduce((pv, cv) => {
            // console.log(pv, 'pv');
            return pv + cv[0] * cv[1];
          }, 0));

    let shippingCost = 0;

    let cartCard =
      this.props.cart &&
      Array.isArray(this.props.cart) &&
      this.props.cart.map(c => {
        const {
          productName,
          price,
          productURL,
          _id,
          quantity,
          productQuantity
        } = c;
        return (
          <CartItem
            key={_id}
            productURL={`${App.domain}public/${productURL[0]}`}
            price={price}
            productName={productName}
            _id={_id}
            quantity={quantity}
            productQuantity={productQuantity}
          />
        );
      });

    // let fakePrice = 1000;
    return (
      <Layout hideFooter isNotHome hideCheckoutDrop>
        <div className={classes.Navigator}>
          <Link to='/'>Home </Link> ><Link to='/cart'> Cart </Link>
          <div className={classes.CartCont}>
            <div className={classes.Left}>
              <div className={classes.CartContent}>
                <div className={classes.CartHeader}>
                  <h2>My Cart</h2>
                  <span
                    className={classes.EmptyCart}
                    onClick={() => this.props.onEmptyCart()}
                  >
                    Empty cart
                  </span>
                </div>

                <div
                  className={[classes.Header, classes.DesktopOnly].join(' ')}
                >
                  <span className={classes.ProductHeader}>Product</span>
                  <span className={classes.PriceHeader}>Price</span>
                  <span className={classes.QuantityHeader}>Quantity</span>
                  <span className={classes.SubTotalHeader}>Sub total</span>
                </div>
              </div>
              <div className={classes.ProductCont}>
                {this.props.cart === 0 ? (
                  <SpinnerTwo />
                ) : Array.isArray(this.props.cart) &&
                  this.props.cart.length === 0 ? (
                  <div className={classes.NoItemInCart}>
                    <p>There are no Items in your cart</p>
                  </div>
                ) : this.props.cart === 'Error occured' ? (
                  this.props.cart
                ) : this.props.cart.length > 0 ? (
                  cartCard
                ) : null}
              </div>
            </div>
            <div className={classes.Right}>
              <div className={classes.SummaryCont}>
                <div className={classes.SummarySubTotal}>
                  <p className={classes.title}>Subtotal</p>
                  <p className={classes.value}>
                    &#x20A6;{' '}
                    {parseFloat(subTotal.toString().replace(/,/g, ''))
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
                <div className={classes.ShippingCost}></div>
                <div className=''>
                  <div className={classes.FinalCost}>
                    <p className={classes.largeTitle}>Grand total</p>
                    <p className={classes.largeValue}>
                      &#x20A6;{' '}
                      {parseFloat(
                        (subTotal + shippingCost).toString().replace(/,/g, '')
                      )
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                  </div>
                </div>
                <div className={classes.ProceedToCheckout}>
                  <button onClick={() => this.props.history.push('/')}>
                    Continue Shopping{' '}
                  </button>
                  <button
                    disabled={
                      !this.props.cart ||
                      !Array.isArray(this.props.cart) ||
                      this.props.cart.length <= 0 ||
                      this.state.loading
                    }
                    onClick={this.checkAuthBeforeCheckout}
                  >
                    Proceed to Delivery{' '}
                    {this.state.loading ? <SpinnerTwo /> : null}
                  </button>
                </div>
              </div>
            </div>
            <div className={classes.mobileSummary}>
              <div className={classes.SummaryCont}>
                <div className={classes.SummarySubTotal}>
                  <p className={classes.title}>Subtotal</p>
                  <p className={classes.value}>
                    &#x20A6;{' '}
                    {parseFloat(subTotal.toString().replace(/,/g, ''))
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className=''>
                  <div className={classes.FinalCost}>
                    <p className={classes.largeTitle}>Grand total</p>
                    <p className={classes.largeValue}>
                      &#x20A6;{' '}
                      {parseFloat(
                        (subTotal + shippingCost).toString().replace(/,/g, '')
                      )
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.BottomStickyCheckout}>
              <div className={classes.ProceedToCheckout}>
                <button onClick={() => this.props.history.push('/')}>
                  Continue Shopping
                </button>
                <button
                  disabled={
                    !this.props.cart ||
                    !Array.isArray(this.props.cart) ||
                    this.props.cart.length <= 0 ||
                    this.state.loading
                  }
                  onClick={this.checkAuthBeforeCheckout}
                >
                  Proceed to Delivery{' '}
                  {this.state.loading ? <SpinnerTwo /> : null}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onFetchCartItems: () => dispatch(fetchAllCartItems()),
    onEmptyCart: () => dispatch(initiateEmptyCart()),
    onShowAuthModalToggle: () => dispatch(toggleAuthModalAction()),
    onAuthLogout: () => dispatch(authLogOut()),
    onAuthSuccess: () => dispatch(authSuccess())
    // onAuthFail: ()=>dispatch(aut)
  };
};

const mapStateToProps = state => {
  return {
    cart: state.cart.cartItems,
    isAuthenticated: state.auth.token !== null,
    authCheckBeforeOpLoading: state.auth.authCheckBeforeOpLoading
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
