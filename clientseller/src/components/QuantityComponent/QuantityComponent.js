import React from 'react';
import classes from './QuantityComponent.module.css';
import PropTypes from 'prop-types';
import SimpleReactValidator from 'simple-react-validator';

export default function QuantityComponent({
  productQuantity,
  showInput,
  validator,
  onEditChange
  // startEdit
}) {
  return (
    <div className={classes.QuantityCont}>
      <span>Quantity: </span>{' '}
      {!showInput ? (
        <span className={classes.productQuantity}>{productQuantity}</span>
      ) : (
        <div className={classes.productQuantityInputCont}>
          <input
            type='text'
            value={productQuantity}
            // autoFocus
            // className={classes.quantityInput}
            onChange={e => {
              validator.message(
                'productQuantity',
                e.target.value,
                'required|integer'
                // 'text-danger'
              );
              onEditChange(e);
              validator.showMessageFor('productQuantity');
              // console.log(validator.allValid());
              // console.log(validator);
            }}
            name='productQuantity'
            className={classes.productQuantityInput}
          />
          {validator.message(
            'productQuantity',
            productQuantity,
            'required|integer'
          )}

          {/* <button></button> */}
        </div>
      )}
    </div>
    // );
  );
}
QuantityComponent.propTypes = {
  // productQuantity: PropTypes.string,
  validator: PropTypes.instanceOf(SimpleReactValidator)
};
