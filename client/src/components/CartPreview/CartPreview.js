import React, { Component } from 'react';
import classes from './CartPreview.module.css';
// import Button from '../UI/Button/Button';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CartPreviewCard from '../CartPreviewCard/CartPreviewCard';

class CartPreview extends Component {
  state = {
    currentValue: this.props.quantity,
    isConfirming: false
  };

  subTotalGen = () => {
    let shippingCost = 0;
    let subTotal =
      this.props.cart &&
      this.props.cart !== 0 &&
      Array.isArray(this.props.cart) &&
      this.props.cart
        .map(c => [c.price, c.quantity])
        .reduce((pv, cv) => pv + cv[0] * cv[1], 0);

    return subTotal + shippingCost;
  };
  CartDetailsGen = () => {
    let cartCard =
      this.props.cart &&
      Array.isArray(this.props.cart) &&
      this.props.cart.map((c, i) => (
        <CartPreviewCard key={i} showCart={this.props.showCart} c={c} />
      ));
    if (
      this.props.cart &&
      Array.isArray(this.props.cart) &&
      this.props.cart.length <= 0
    ) {
      cartCard = (
        <div>
          <p className={classes.EmptyCart}>Your Cart is Empty</p>
        </div>
      );
    }
    return cartCard;
  };

  disableScroll = () => {
    // Get the current page scroll position
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // if any scroll is attempted,
    // set this to the previous value
    window.onscroll = function() {
      window.scrollTo(scrollLeft, scrollTop);
    };
  };

  enableScroll = () => {
    window.onscroll = function() {};
  };

  // pure render function
  render() {
    return (
      <React.Fragment>
        <div
          onClick={this.props.toggleCartPreview}
          className={
            this.props.showCart
              ? classes.CartPreviewBackdrop
              : [classes.CartPreviewBackdrop, classes.Rotate90].join(' ')
          }
        ></div>

        <div
          className={
            this.props.showCart
              ? classes.CartPreview
              : [classes.CartPreview, classes.Rotate90].join(' ')
          }
        >
          <div className={classes.FirstItemInPreview}>
            <div className={classes['arrow-up']}></div>
            <div className={classes.CartPrevHeader}>
              <div className={classes.CartTitle}>
                <h4>Your Cart</h4>
              </div>
              <div className={classes.CartAmount}>
                <p className={classes.valueLarge}>
                  &#x20A6;{' '}
                  {parseFloat(
                    this.subTotalGen()
                      .toString()
                      .replace(/,/g, '')
                  )
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
              </div>
            </div>
            <div className={classes.CartDets}>{this.CartDetailsGen()}</div>

            <div className={classes.ButtonCheckoutCont}>
              <div>
                <button
                  onClick={() => this.props.toggleCartPreview()}
                  className={classes.shopping}
                >
                  Continue Shopping
                </button>
              </div>
              <div>
                <button
                  disabled={this.subTotalGen() <= 0}
                  className={classes.checkout}
                  onClick={() => {
                    this.props.toggleCartPreview();
                    this.props.history.push('/cart');
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return {
    isEditing: state.cart.isEditing
  };
};
export default withRouter(connect(mapStateToProps)(CartPreview));
// export default ;
