import React, { useState, useEffect } from 'react';
import classes from './CarouselCard.module.css';
// import { Button } from 'semantic-ui-react';
import Spin from '../../shared/images/loading_spinner.gif';
import Button from '../UI/Button/Button';
import {
  editAndRefreshCart,
  initiateDeleteItemFromCart
} from '../../store/actions/cart';
import { connect } from 'react-redux';
const returnQuantity = props => {
  if (props.cart) {
    let productInCart = props.cart.find(c => c._id === props.id);
    if (productInCart) return productInCart.quantity;
  }
  return 1;
};

const isInCartAlready = props => {
  let isInCart =
    props &&
    props.cart &&
    props.cart.filter(cart => cart._id === props.id).length > 0;

  return isInCart;
};
const CarouselCard = props => {
  const [currentValue, setCurrentValue] = useState(returnQuantity(props));
  const [loading, setLoading] = useState(true);
  const [quantityDiv, showQuantity] = useState(isInCartAlready());

  useEffect(() => {
    // console.log('effect');
    // console.log(myprice, price);
    if (currentValue !== returnQuantity(props)) {
      if (currentValue == '') {
        setCurrentValue('');
      } else {
        setCurrentValue(returnQuantity(props));
      }
      // console.log(currentValue);
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
      productId: id
    });
  };
  // console.log(props.cart);

  const addCartAndShowQuantity = () => {
    if (!isInCartAlready(props)) {
      props.addCart();
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
        productId: props.id
      });
    }
  };

  return (
    <div
      style={{
        minWidth: props.isCarousel ? 200 : 'none',
        marginRight: props.isCarousel ? 20 : 'none'
      }}
      className={[classes.CarouselCardContainer, classes.card].join(' ')}
    >
      <div className={classes.ImageContainer}>
        <img
          className={classes.prod}
          onClick={props.goToDetail}
          src={props.productURL}
          alt=''
          onLoad={() => setLoading(false)}
        />
        {loading ? <img src={Spin} alt='' className={classes.spin} /> : null}
      </div>

      <hr />
      <div className={classes.TextContainer}>
        <h4 className={classes.Title} onClick={props.goToDetail}>
          {props.productName}
        </h4>
        <h4 className={classes.Price}>&#8358;{props.price}</h4>
        {props.hideCart ? null : (
          <div
            className={
              quantityDiv && isInCartAlready(props)
                ? [classes.ButtonCont, classes.Rotate90].join(' ')
                : classes.ButtonCont
            }
          >
            <Button clicked={addCartAndShowQuantity} btnType='Geetico'>
              {' '}
              Add To Cart{' '}
            </Button>
          </div>
        )}
        {/* <h6 className={classes.Discount}>{props.Discount} Off</h6> */}
        <div
          className={
            quantityDiv && isInCartAlready(props)
              ? classes.changeCont
              : [classes.changeCont, classes.Rotate90].join(' ')
          }
        >
          <button onClick={() => productQuantChange('-', props.id)}>-</button>
          <input
            onChange={inputChange}
            type='number'
            name='currentValue'
            onChange={e => inputChange(e, props.id)}
            value={currentValue}
            // onClick={this.setSelectionRange(0, this.value.length)}
          />
          <button onClick={() => productQuantChange('+', props.id)}>+</button>
        </div>
      </div>
    </div>
  );
};
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
)(CarouselCard);
