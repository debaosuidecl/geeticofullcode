import React from 'react';
import classes from './SearchSuggestions.module.css';
export default function SearchSuggestion({ showDropDown, suggestions }) {
  return showDropDown && suggestions.length > 0 ? (
    <div className={classes.suggestions}>
      {suggestions.length > 0 &&
        suggestions.map(sug => {
          return (
            <a key={sug._id} href={`/details/${sug._id}`}>
              <div className={classes.singleSuggestion}>
                <img
                  src={`http://geetico.com/public/${sug.productURL[0]}`}
                  className={classes.productImage}
                  alt=''
                />
                <p>{sug.productName}</p>
              </div>
            </a>
          );
        })}
    </div>
  ) : null;
}
