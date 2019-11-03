import React from 'react';
import classes from './ProductAddCard.module.css';
import SuccessImg from './success2.png';
export default function ProductAddCard() {
  return (
    <div className={classes.ProductAddCard}>
      <div>
        <img width='30px' src={SuccessImg} alt='product' />
      </div>
      <div>
        <p>New Product Successfully added</p>
      </div>
    </div>
  );
}
