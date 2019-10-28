import React from 'react';
import classes from './CategoryComponent.module.css';
import PropTypes from 'prop-types';
import SimpleReactValidator from 'simple-react-validator';
const allowedCategories = [
  'Beer, Wine & Spirit',
  'Food Cupboard',
  'Beverages',
  'Drinks',
  'Cooking & Baking',
  'Dried Beans, Grains & Rice',
  'Breakfast Foods',
  'Herbs Spices & Seasoning',
  'Candy & Chocolate',
  'Canned, Jarred & Packaged Foods',
  'Jams, Jellies & Sweet Spreads',
  'Condiments & Salad Dressings'
];
export default function CategoryComponent({
  category,
  showInput,
  validator,
  onEditChange
  // startEdit
}) {
  return (
    // <div>
    !showInput ? (
      <div className={classes.Category}>
        <h3>
          <strong>Category</strong>
        </h3>
        <p>{category}</p>
      </div>
    ) : (
      <div className={classes.categoryInputCont}>
        <h3>
          <strong>Category:</strong>
        </h3>
        <select
          value={category}
          className={classes.categoryInput}
          onChange={e => {
            validator.message('category', e.target.value, 'required');
            onEditChange(e);
            validator.showMessageFor('category');
            // console.log(validator);
          }}
          name='category'
          // className={classes.productNameInput}
        >
          <option value={category}>{category}</option>
          {/* // eslint-disable-next-line */}
          {// eslint-disable-next-line
          allowedCategories.map((cat, i) => {
            if (cat !== category) {
              return (
                <option key={i} value={cat}>
                  {cat}
                </option>
              );
            }
          })}
        </select>
        {validator.message('category', category, 'required')}

        {/* <button></button> */}
      </div>
    )
    // </div>
  );
}
CategoryComponent.propTypes = {
  category: PropTypes.string,
  validator: PropTypes.instanceOf(SimpleReactValidator)
};
