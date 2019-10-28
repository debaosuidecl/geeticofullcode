import React, { Component } from 'react';
import classes from './InputTag.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWindowClose
  // faAngleDown
} from '@fortawesome/free-solid-svg-icons';

export class InputTag extends Component {
  render() {
    return (
      <div className={classes.TagCont}>
        <p>
          Enter Search Tags{' '}
          <span style={{ color: '#888' }}>(Up to 5 tags comma seperated)</span>
        </p>

        <div className={classes.TagDiv} onClick={this.focus}>
          {/* <p>Product Search Tags</p> */}
          {this.props.tags &&
            this.props.tags.length > 0 &&
            this.props.tags.map((tag, i) => {
              return (
                <span className={classes.selectedTag} key={i}>
                  <span className={classes.tagText}>{tag}</span>
                  <FontAwesomeIcon
                    icon={faWindowClose}
                    onClick={() => this.props.deleteTagHandler(i)}
                  />
                </span>
              );
            })}

          <input
            onKeyDown={this.props.keyPressHandler}
            onChange={this.props.inputTagChangeHandler}
            type='text'
            ref={this.textInput}
            name='value'
            value={this.props.value}
            disabled={this.props.tags && this.props.tags.length > 4}
          />
        </div>
      </div>
    );
  }
}

export default InputTag;
