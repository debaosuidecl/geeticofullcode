import React from 'react';
import classes from './DesktopDropDown.module.css';
import App from '../../App';
// import { Link } from 'react-router-dom';

const DesktopDropDown = props => {
  return (
    <div
      className={classes.DesktopDropDownCont}
      style={{ display: props.show ? 'block' : 'none' }}
    >
      <div className={classes['arrow-up']}></div>
      <div className={classes.DesktopDropDown}>
        <div className={classes.Header}></div>
        <div className={classes.Body} {...props}>
          {App.allowedCategories.map((a, i) => (
            <div key={i}>
              <a href={`/category/${a}`}>{a}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopDropDown;
