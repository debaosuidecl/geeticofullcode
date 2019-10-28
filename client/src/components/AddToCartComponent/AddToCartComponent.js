import React, { useState, useEffect } from 'react';
import classes from './AddToCartComponent.module.css';
import Button from '../UI/Button/Button';
import { connect } from 'react-redux';
import {
  initiateAddToCart,
  editAndRefreshCart,
  initiateDeleteItemFromCart
} from '../../store/actions/cart';

const returnQuantity = props => {
  if (props.cart) {
    let productInCart = props.cart.find(c => c._id === props.productId);
    if (productInCart) return productInCart.quantity;
  }
  return 1;
};

const isInCartAlready = props => {
  let isInCart =
    props &&
    props.cart &&
    props.cart.filter(cart => cart._id === props.productId).length > 0;

  return isInCart;
};
const AddToCartComponent = props => {
  const [currentValue, setCurrentValue] = useState(returnQuantity(props));
  const [loading, setLoading] = useState(true);
  const [quantityDiv, showQuantity] = useState(isInCartAlready());
  useEffect(() => {
    if (currentValue !== returnQuantity(props)) {
      if (currentValue == '') {
        setCurrentValue('');
      } else {
        setCurrentValue(returnQuantity(props));
      }
    }
  });
  const productQuantChange = (inc, id) => {
    if (
      (currentValue === 1 && inc === '-') ||
      currentValue === '' ||
      currentValue <= 0 ||
      !/^[0-9]*$/.test(currentValue)
    ) {
      return;
    }

    setCurrentValue(
      inc === '+' ? parseInt(currentValue) + 1 : parseInt(currentValue) - 1
    );
    props.onEditQuant({
      quantity:
        inc === '+' ? parseInt(currentValue) + 1 : parseInt(currentValue) - 1,
      productId: props.productId
    });
  };

  const addCartAndShowQuantity = () => {
    if (!isInCartAlready(props)) {
      props.onAddToCart({
        productId: props.productId,
        quantity: 1,
        fullProduct: props.details
      });
    }
    showQuantity(true);
  };

  const inputChange = e => {
    setCurrentValue(e.target.value);
    if (
      /^[0-9]*$/.test(e.target.value) &&
      e.target.value !== '' &&
      e.target.value !== '0'
    ) {
      props.onEditQuant({
        quantity: e.target.value,
        productId: props.productId
      });
    }
  };

  return (
    <div className={classes.AddToCartComponent}>
      <div
        className={
          quantityDiv && isInCartAlready(props)
            ? [classes.ButtonCont, classes.Rotate90].join(' ')
            : classes.ButtonCont
        }
      >
        {isInCartAlready(props) && !quantityDiv ? (
          <p
            style={{
              color: 'gold'
            }}
          >
            {returnQuantity(props)} already in your Cart
          </p>
        ) : null}
        <Button clicked={addCartAndShowQuantity} btnType='Geetico'>
          {' '}
          Add To Cart{' '}
        </Button>
      </div>

      <div
        className={
          quantityDiv && isInCartAlready(props)
            ? classes.changeCont
            : [classes.changeCont, classes.Rotate90].join(' ')
        }
      >
        <button onClick={() => productQuantChange('-', props.productId)}>
          -
        </button>
        <input
          onChange={inputChange}
          type='number'
          name='currentValue'
          onChange={e => inputChange(e, props.productId)}
          value={currentValue}
        />
        <button onClick={() => productQuantChange('+', props.productId)}>
          +
        </button>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onEditQuant: prodData => dispatch(editAndRefreshCart(prodData, true)),
    onAddToCart: prodData => dispatch(initiateAddToCart(prodData)),
    onRemove: prodData => dispatch(initiateDeleteItemFromCart(prodData))
  };
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    isEditing: state.cart.isEditing,
    cart: state.cart.cartItems
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToCartComponent);
// const mapStateToProps = state => {
//   return {
//     cart: state.cart.itemCount
//   };
// };
// const mapDispatchToProps = dispatch => {
//   return {
//     onAddToCart: prodData => dispatch(initiateAddToCart(prodData))
//   };
// };
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(AddToCartComponent);
