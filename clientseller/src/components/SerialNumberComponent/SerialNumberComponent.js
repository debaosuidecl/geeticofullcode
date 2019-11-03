import React from 'react';
import classes from './SerialNumberComponent.module.css';
import PropTypes from 'prop-types';
import SimpleReactValidator from 'simple-react-validator';

export default function SerialNumberComponent({
  referenceNumber,
  showInput,
  validator,
  onEditChange,
  startEdit
}) {
  return (
    <div className={classes.SerialCont}>
      {referenceNumber.length > 0 || showInput ? (
        <span>Serial Number: </span>
      ) : null}
      {!showInput && referenceNumber.length > 0 ? (
        <span className={classes.referenceNumber}>{referenceNumber}</span>
      ) : showInput ? (
        <div className={classes.referenceNumberInputCont}>
          <input
            type='text'
            value={referenceNumber}
            // autoFocus
            // className={classes.quantityInput}
            onChange={e => {
              // validator.message(
              //   'referenceNumber',
              //   e.target.value,
              //   'required'
              //   // 'text-danger'
              // );
              onEditChange(e);
              validator.showMessageFor('referenceNumber');
              // console.log(validator.allValid());
              // console.log(validator);
            }}
            name='referenceNumber'
            className={classes.referenceNumberInput}
          />
        </div>
      ) : null}
    </div>
  );
  // );
}

SerialNumberComponent.propTypes = {
  productName: PropTypes.string,
  validator: PropTypes.instanceOf(SimpleReactValidator)
};
