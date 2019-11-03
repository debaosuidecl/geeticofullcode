import React, { Component } from 'react';
import { imageZoom } from '../../shared/utitlity';
import classes from './ImagePreview.module.css';
import BackDrop from '../UI/Backdrop/Backdrop';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class ImagePreview extends Component {
  // componentDidMount() {}
  prevHandle = () => {
    imageZoom('myimage', 'myresult');
  };
  render() {
    let prevClasses = this.props.onPrev
      ? [classes.ImagePreview, classes.zoomClass].join(' ')
      : classes.ImagePreview;
    return (
      <div className={classes.ImagePreviewContainer}>
        <BackDrop show={this.props.onPrev} />
        <div className={prevClasses}>
          <div className={classes.imgCont} id='zoomImageInImagePreviewSeller'>
            <img
              onDoubleClick={this.props.zoomToggle}
              src={this.props.onPrev}
              alt='test'
              id='myimage'
              // onMouseOver={this.prevHandle}
              style={{
                cursor: this.props.isZoom ? 'zoom-out' : 'zoom-in',
                transform: this.props.isZoom ? 'scale(2.5)' : 'scale(1.0)'
              }}
            />
          </div>
          {/* <div id='myresult' className='img-zoom-result'></div> */}

          {/* <div style={{ position: "absolute", top: "20px", right: "30px" }}>
            
          </div> */}
          <div className={classes.PreviewHeader}>
            <h2>Product Image Preview</h2>
            <FontAwesomeIcon
              icon={faTimes}
              size='2x'
              onClick={this.props.closed}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ImagePreview;
