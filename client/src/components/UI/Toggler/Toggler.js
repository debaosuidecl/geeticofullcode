import React from 'react';
import classes from './Toggler.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Toggler = props => {
  let Toggle = (
    <div
      onClick={props.clicked}
      className={classes.Toggler}
      style={{ display: props.forceShow ? 'block' : 'none' }}
      // style={{ background: props.background }}
    >
      <div
        className={classes.CounterClockwise}
        style={{ background: props.background }}
      />
      <div
        className={classes.Clockwise}
        style={{ background: props.background }}
      />
      <div style={{ background: props.background }} />
    </div>
  );
  if (props.isToggled) {
    Toggle = (
      <div onClick={props.clicked} className={classes.Close}>
        <FontAwesomeIcon size='2x' icon={faTimes} color={props.color} />
      </div>
    );
  }

  return Toggle;
};

export default Toggler;
