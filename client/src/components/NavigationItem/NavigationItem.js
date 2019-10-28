import React from 'react';
// import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './NavigationItem.module.css';

const navigationItem = props => {
  let classType = [classes.NavigationItem].join(' ');
  if (props.ActiveNav && props.isSeller) {
    classType = [classes.NavigationItem, classes.Seller, classes.Active].join(
      ' '
    );
  }
  if (props.isSeller && !props.ActiveNav) {
    classType = [classes.NavigationItem, classes.Seller].join(' ');
  }
  if (props.isBuyer) {
    classType = [classes.NavigationItem, classes.Orange].join(' ');
  }

  switch (props.linkType) {
    case 'ReactLink':
      return (
        <li className={classType} onClick={props.clicked}>
          <a href={props.to} rel='noreferrer'>
            {props.addIcon ? (
              <span className={classes.Font}>
                <FontAwesomeIcon icon={props.icon} />
              </span>
            ) : null}
            {props.children}
          </a>
        </li>
      );

    default:
      return;
  }
};

export default navigationItem;
