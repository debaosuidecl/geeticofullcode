import React from 'react';
import classes from './CustomerItem.module.css';
function CustomerItem({ c }) {
  return (
    <div className={classes.CustomerItem}>
      <div className={classes.avatar}>
        <img width={50} src={c.avatar} alt='' />
      </div>
      <div className={classes.Details}>
        <p className={classes.fullName}>{c.fullName}</p>
        <p className={classes.email}>{c.email}</p>
        {c.phone ? <p className={classes.phoneNumber}>+234{c.phone}</p> : null}
      </div>
    </div>
  );
}

export default CustomerItem;
