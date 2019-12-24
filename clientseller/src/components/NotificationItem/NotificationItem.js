import React from 'react';
import classes from './NotificationItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
export default function NotificationItem({ item }) {
  return (
    <Link to={`/sellerpage/single-order/${item.order}`}>
      <div className={classes.NotificationItem}>
        <div>
          {' '}
          <FontAwesomeIcon
            style={{ color: item.read == false ? '#6ce001' : '#eee' }}
            icon={faCheckCircle}
          />{' '}
        </div>

        <p style={{ color: item.read == false ? '#333' : '#bbb' }}>
          {item.notification}
        </p>
      </div>
    </Link>
  );
}
