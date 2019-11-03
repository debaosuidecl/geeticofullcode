import React from 'react';
import Button from '../UI/Button/Button';
import classes from './EditUpdateSwitchComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
export default function EditUpdateSwitchComponent({
  isEditable,
  showInput,
  startEdit,
  updateHandler,
  formValidity
}) {
  return (
    <div className={classes.EditUpdateSwitchCont}>
      {isEditable && !showInput ? (
        <div className={classes.EditProductHandler}>
          {' '}
          <span onClick={startEdit} className={classes.EditProductHandlerBody}>
            <FontAwesomeIcon icon={faPen} /> <span>Edit Product</span>
          </span>
        </div>
      ) : showInput ? (
        <div className={classes.UpdateCont}>
          <Button clicked={updateHandler} btnType='Go' disabled={formValidity}>
            Update
          </Button>
        </div>
      ) : null}
    </div>
  );
}
