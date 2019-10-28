import InputTags from '../../components/InputTag/InputTag';
import React from 'react';
import classes from './SearchTagComponent.module.css';
import PropTypes from 'prop-types';
import SimpleReactValidator from 'simple-react-validator';

export default function SearchTagComponent({
  tags,
  showInput,
  onInputTagChangeHandler,
  searchTagConfigValue,
  deleteTagHandler,
  keyPressHandler
  // validator,
  // onEditChange,
  // startEdit
}) {
  return (
    // <div>
    !showInput ? (
      Array.isArray(tags) && tags.length <= 0 ? (
        <p>Product has no tags</p>
      ) : (
        <div className={classes.SearchTagsCont}>
          {tags &&
            tags.map((tag, i) => {
              return (
                <span className={classes.Tag} key={i}>
                  {tag}
                </span>
              );
            })}
        </div>
      )
    ) : (
      <InputTags
        tags={tags}
        inputTagChangeHandler={onInputTagChangeHandler}
        value={searchTagConfigValue}
        deleteTagHandler={deleteTagHandler}
        keyPressHandler={keyPressHandler}
      />
    )
    // </div>
  );
}
SearchTagComponent.propTypes = {
  productName: PropTypes.string,
  validator: PropTypes.instanceOf(SimpleReactValidator)
};
