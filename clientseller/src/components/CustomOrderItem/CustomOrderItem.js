import React from 'react';
import classes from './CustomOrderItem.module.css';
function CustomOrderItem({ c }) {
  return (
    <div className={classes.CustomerItem}>
      <div className={classes.avatar}>
        <img width={50} src={c.avatar} alt='' />
      </div>
      <div className={classes.Details}>
        <p className={classes.fullName}>{c.fullName}</p>
        <p className={classes.email}>{c.email}</p>
        {c.phone ? <p className={classes.phoneNumber}>+234{c.phone}</p> : null}
        <p className={classes.emaiil}>{c.productDetails}</p>
      </div>
    </div>
  );
}

export default CustomOrderItem;
