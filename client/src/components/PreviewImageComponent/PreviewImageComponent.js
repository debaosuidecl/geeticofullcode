import React from 'react';
import classes from './PreviewImageComponent.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SimpleReactValidator from 'simple-react-validator';
import { Lightbox } from 'react-modal-image';

// import AddNewImageComponent from '../AddNewImageComponent/AddNewImageComponent';
import SpinnerTwo from '../UI/Spinner2/Spinner2';
import App from '../../App';
export default function PreviewImageComponent({
  productName,
  showInput,
  previewOpen,
  selectLink,
  setActiveLink,
  productURL,
  previewOpenHandler,
  deleteImageHandler,
  onAddNewImage,
  isUpdating
  // validator,
  // onEditChange,
  // startEdit
}) {
  let addNewImageBox = null;
  if (showInput && productURL.length < 3) {
    // addNewImageBox = <AddNewImageComponent onAddNewImage={onAddNewImage} />;
    addNewImageBox = '';
  }
  return (
    <div className={classes.ProductImagesCont}>
      {/* This container holds both main and preview Image */}
      <div className={classes.MainImageCont}>
        <img
          src={`${App.domain}public/${selectLink}`}
          alt={productName}
          className={classes.previewImage}
          onClick={previewOpenHandler}
        />

        {previewOpen && (
          <div className={classes.LightboxCont}>
            <Lightbox
              showRotate
              medium={`${App.domain}public/${selectLink}`}
              large={`${App.domain}public/${selectLink}`}
              alt={productName}
              onClose={previewOpenHandler}
            />
          </div>
        )}
      </div>
      <div className={classes.OtherImagesCont}>
        {isUpdating ? <SpinnerTwo /> : null}
        {productURL.map((img, i) => {
          return (
            <span key={i} className={classes.DeleteImageCont}>
              {showInput ? (
                <FontAwesomeIcon
                  color='red'
                  onClick={() => deleteImageHandler(i)}
                  className={classes.DeleteImage}
                  icon={faTimes}
                />
              ) : null}
              <img
                height='70'
                alt={img}
                src={`${App.domain}public/${img}`}
                onClick={() => setActiveLink(img)}
              />
            </span>
          );
        })}
        {addNewImageBox}
        {/* if the length of images is less than 3 then I want to show the add new image box */}
      </div>
    </div>
  );
}
PreviewImageComponent.propTypes = {
  productName: PropTypes.string,
  validator: PropTypes.instanceOf(SimpleReactValidator)
};
