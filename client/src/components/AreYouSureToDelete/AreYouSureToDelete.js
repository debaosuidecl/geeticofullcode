import React from 'react';
import classes from './AreYouSureToDelete.module.css';
import Button from '../UI/Button/Button';
export default function AreYouSureToDelete({
  name,
  imageUrl,
  toggleModal,
  finalDelete
}) {
  return (
    <div className={classes.AreYouSureToDeleteCont}>
      <h5>Are you sure you want to delete {name}?</h5>

      <img src={imageUrl} alt='' />
      <div className={classes.ButtonCont}>
        <Button btnType='Go' clicked={finalDelete}>
          Yes
        </Button>
        <Button btnType='Danger' clicked={toggleModal}>
          No
        </Button>
      </div>
    </div>
  );
}
