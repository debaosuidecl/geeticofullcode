import React from 'react';
import classes from './imageInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const imageInput = props => {
  let inputImage = (imageNumber, htmlFor) => (
    <label
      style={{
        boxShadow: props.isover ? '0px 1px 4px #bbb' : 'none',
        transition: '.4s'
      }}
      className={classes.noImgLabel}
      htmlFor={htmlFor}
    >
      <div>
        {!props.isover ? (
          <div className={classes.labelText}>
            <p>{imageNumber}</p>
            <p>
              <FontAwesomeIcon icon={props.icon} size='2x' color='#bbb' />
            </p>
          </div>
        ) : (
          <p
            style={{
              color: 'rgb(58, 6, 117)',
              border: '3px dotted rgb(58, 6, 117)',
              padding: '15px'
            }}
          >
            Drop Image Here
          </p>
        )}
      </div>
    </label>
  );
  return (
    <div className={classes.inputfileCont}>
      <input
        {...props}
        className={classes.inputfile}
        accept='image/jpeg, image/png'
      />
      {!props.imagepreview ? (
        inputImage(props.imagenumber, props.inputid)
      ) : (
        <div className={classes.imgsurroundlabel}>
          {/* <div className={classes.slideUp} /> */}

          {props.imagepreview}
        </div>
      )}
    </div>
  );
};

export default imageInput;
