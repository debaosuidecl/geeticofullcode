import React from 'react';
import classes from './SearchBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const SearchBar = props => {
  return (
    <div className={classes.InputContainer}>
      <input
        type='text'
        value={props.search}
        onBlur={props.onBlurHandler}
        onFocus={props.onFocusHandler}
        name='search'
        onKeyDown={props.keyDownHandler}
        onChange={props.textChangeHandler}
        className={classes.SearchInput}
        autoComplete='off'
        placeholder='Search Categories & Products...'
      />
      <button className={classes.Button} onClick={props.clicked}>
        <FontAwesomeIcon size='lg' icon={props.searchIcon} />
      </button>
    </div>
  );
};

export default SearchBar;
