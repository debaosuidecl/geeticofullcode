import React from 'react';
import classes from './DescriptionComponent.module.css';
import PropTypes from 'prop-types';
import SimpleReactValidator from 'simple-react-validator';

export default function DescriptionComponent({
  description,
  showInput,
  validator,
  onEditChange,
  startEdit
}) {
  return (
    // <div>
    !showInput ? (
      <div className={classes.Description}>
        <h2>
          <strong>Description</strong>
        </h2>
        <p>{description}</p>
      </div>
    ) : (
      <div className={classes.descriptionInputCont}>
        <h2>
          <strong>Description</strong>
        </h2>
        <textarea
          className={classes.descriptionInput}
          onChange={e => {
            validator.message(
              'description',
              e.target.value,
              'required|min:9|max:300'
              // 'text-danger'
            );
            onEditChange(e);
            validator.showMessageFor('description');
            // console.log(validator.allValid());
            // console.log(validator);
          }}
          name='description'
          // className={classes.descriptionInput}
          value={description}
        ></textarea>
        {validator.message(
          'description',
          description,
          'required|min:9|max:300'
        )}

        {/* <button></button> */}
      </div>
    )
    // </div>
  );
}
DescriptionComponent.propTypes = {
  description: PropTypes.string,
  validator: PropTypes.instanceOf(SimpleReactValidator)
};
