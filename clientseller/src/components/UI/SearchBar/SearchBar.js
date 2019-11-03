import React from "react";
import classes from "./SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const SearchBar = props => {
  return (
    <div className={classes.InputContainer}>
      <input
        type="text"
        value={props.search}
        name="search"
        onChange={props.textChangeHandler}
        className={classes.SearchInput}
        placeholder="Search Categories & Products..."
      />
      <button className={classes.Button}>
        <FontAwesomeIcon size="lg" icon={props.searchIcon} />
      </button>
    </div>
  );
};

export default SearchBar;
