import React from 'react';
import classes from './ProductNameComponent.module.css';
import PropTypes from 'prop-types';
import SimpleReactValidator from 'simple-react-validator';

export default function ProductNameComponent({
  productName,
  showInput,
  validator,
  onEditChange,
  startEdit
}) {
  return (
    // <div>
    !showInput ? (
      <h2 className={classes.productName} onDoubleClick={startEdit}>
        {productName}
      </h2>
    ) : (
      <div className={classes.productNameInputCont}>
        <input
          type='text'
          value={productName}
          autoFocus
          // className={classes.productNameInput}
          onChange={e => {
            validator.message(
              'productName',
              e.target.value,
              'required|min:4|max:40'
              // 'text-danger'
            );
            onEditChange(e);
            validator.showMessageFor('productName');
            // console.log(validator.allValid());
            // console.log(validator);
          }}
          name='productName'
          className={classes.productNameInput}
        />
        {validator.message('productName', productName, 'required|min:4|max:40')}

        {/* <button></button> */}
      </div>
    )
    // </div>
  );
}
ProductNameComponent.propTypes = {
  productName: PropTypes.string,
  validator: PropTypes.instanceOf(SimpleReactValidator)
};
