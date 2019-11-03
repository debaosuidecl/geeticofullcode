import React from 'react';
import PropTypes from 'prop-types';
import SimpleReactValidator from 'simple-react-validator';
import classes from './PriceComponent.module.css';
export default function ProductNameComponent({
  price,
  showInput,
  validator,
  onEditChange
}) {
  return (
    // <div>
    !showInput ? (
      <React.Fragment>
        <span className={classes.price}>
          &#x20A6;{' '}
          {parseFloat(price.toString().replace(/,/g, ''))
            .toFixed(0)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </span>
        <span> /per pc</span>
      </React.Fragment>
    ) : (
      <div className={classes.priceInputCont}>
        <span className={classes.currencyCont}>&#x20A6; </span>
        <input
          type='text'
          value={price}
          // autoFocus
          className={classes.priceInput}
          onChange={e => {
            validator.message('price', e.target.value, 'required|currency');
            onEditChange(e);
            validator.showMessageFor('price');
            // console.log(validator);
          }}
          name='price'
        />
        {validator.message('price', price, 'required|currency')}
      </div>
    )
    // </div>
  );
}
ProductNameComponent.propTypes = {
  // price: PropTypes.number,
  validator: PropTypes.instanceOf(SimpleReactValidator)
};
