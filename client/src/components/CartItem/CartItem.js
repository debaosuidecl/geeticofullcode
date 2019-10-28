import React from 'react';
import classes from './CartItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import {
  editAndRefreshCart,
  initiateDeleteItemFromCart
} from '../../store/actions/cart';
import SpinnerTwo from '../UI/Spinner2/Spinner2';
// import AddToCartComponent from '../AddToCartComponent/AddToCartComponent';

class CartItem extends React.Component {
  state = {
    currentValue: this.props.quantity,
    isConfirming: false
  };

  productQuantChange = inc => {
    if (
      (this.state.currentValue === 1 && inc === '-') ||
      this.state.currentValue === '' ||
      this.state.currentValue <= 0 ||
      !/^[0-9]*$/.test(this.state.currentValue)
    ) {
      return;
    }
    this.setState(ps => {
      this.props.onEditQuant({
        quantity:
          inc === '+'
            ? parseInt(ps.currentValue) + 1
            : parseInt(ps.currentValue) - 1,
        productId: this.props._id
      });
      return {
        currentValue:
          inc === '+'
            ? parseInt(ps.currentValue) + 1
            : parseInt(ps.currentValue) - 1
      };
    });
  };
  inputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    if (
      /^[0-9]*$/.test(e.target.value) &&
      e.target.value !== '' &&
      e.target.value !== '0'
    ) {
      this.props.onEditQuant({
        quantity: e.target.value,
        productId: this.props._id
      });
    }
  };

  confirmHandler = () => {
    this.setState(pState => {
      return {
        isConfirming: !pState.isConfirming
      };
    });
  };

  render() {
    const { productURL, productName, price } = this.props;
    return (
      <div className={classes.CartItem}>
        <div className={classes.CartItemImageCont}>
          <img src={productURL} height={100} alt={productName} />
        </div>
        <div className={classes.CartDetailCont}>
          <div className={classes.DetailTop}>
            <p>{productName}</p>
          </div>
          <div className={classes.DetailBottom}>
            <p className={classes.Price}>
              &#x20A6;{' '}
              {parseFloat(price.toString().replace(/,/g, ''))
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              /unit
            </p>
            <div className={classes.QuantityCont}>
              <div className={classes.ChangeQuant}>
                <button onClick={() => this.productQuantChange('-')}>-</button>
                <input
                  type='number'
                  name='currentValue'
                  onChange={this.inputChange}
                  value={this.state.currentValue}
                />
                <button onClick={() => this.productQuantChange('+')}>+</button>
              </div>
              {/* <span onClick={() => console.log('update')}>Update</span> */}
              <span>{this.props.isEditing ? <SpinnerTwo /> : null}</span>
              {/* <AddToCartComponent productId={_id} notForCard /> */}
            </div>
            <div className={classes.SubTotalCont}>
              <span>
                &#x20A6;{' '}
                {parseFloat(
                  (this.props.quantity * price).toString().replace(/,/g, '')
                )
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
              <span className={classes.DeleteCont}>
                {this.state.isConfirming ? (
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      className={classes.ConfirmCont}
                      onClick={() => {
                        this.props.onRemove({ productId: this.props._id });
                        this.confirmHandler();
                      }}
                    >
                      Confirm
                    </span>
                    <FontAwesomeIcon
                      onClick={this.confirmHandler}
                      color='yellowgreen'
                      icon={faSync}
                    />
                  </span>
                ) : (
                  <span
                    onClick={this.confirmHandler}
                    className={classes.Remove}
                  >
                    Remove
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onEditQuant: prodData => dispatch(editAndRefreshCart(prodData, true)),
    onRemove: prodData => dispatch(initiateDeleteItemFromCart(prodData))
  };
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    isEditing: state.cart.isEditing
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartItem);
