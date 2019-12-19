import React, { useState, useEffect } from 'react';
import classes from './CartPreviewCard.module.css';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  editAndRefreshCart,
  initiateDeleteItemFromCart
} from '../../store/actions/cart';
import App from '../../App';

function CartPreviewCard({ c, onEditQuant, onRemove, showCart }) {
  // console.log(showCart);
  // console.log(c, 'from cart card');

  const { productName, price, productURL, _id, quantity } = c;

  // const [myprice] = useState(price);
  const [currentValue, setCurrentValue] = useState(quantity);
  useEffect(() => {
    // console.log('effect');
    // console.log(myprice, price);
    if (currentValue !== quantity) {
      if (currentValue == '') {
        setCurrentValue('');
      } else {
        setCurrentValue(quantity);
      }
      // console.log(currentValue);
    }
  });
  const inputChange = (e, id) => {
    setCurrentValue(e.target.value);
    if (
      /^[0-9]*$/.test(e.target.value) &&
      e.target.value !== '' &&
      e.target.value !== '0'
    ) {
      onEditQuant({
        quantity: e.target.value,
        productId: id
      });
    }
  };

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
    onEditQuant({
      quantity:
        inc === '+' ? parseInt(currentValue) + 1 : parseInt(currentValue) - 1,
      productId: id
    });
  };
  return (
    <div key={_id} className={classes.CartCard}>
      <div className={classes.ImgCont}>
        <img src={`https://geetico.com/public/${productURL[0]}`} alt='' />
      </div>
      <p className={classes.productName}>{productName}</p>
      <div className={classes.changeCont}>
        <button onClick={() => productQuantChange('-', _id)}>-</button>
        <input
          type='number'
          name='currentValue'
          onChange={e => inputChange(e, _id)}
          value={currentValue}
          // value={quantity}
        />
        <button onClick={() => productQuantChange('+', _id)}>+</button>
      </div>
      <span className={classes.Total}>
        &#x20A6;{' '}
        {parseFloat((quantity * price).toString().replace(/,/g, ''))
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </span>
      <span className={classes.Delete}>
        <FontAwesomeIcon
          icon={faTrashAlt}
          onClick={() => {
            onRemove({ productId: _id });
          }}
        />
      </span>
    </div>
  );
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
export default connect(mapStateToProps, mapDispatchToProps)(CartPreviewCard);
