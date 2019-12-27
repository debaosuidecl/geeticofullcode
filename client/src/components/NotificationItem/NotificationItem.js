import React from 'react';
import classes from './NotificationItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

export default function NotificationItem({ item }) {
  const now = moment(item.date).fromNow();
  return (
    <a href={`/sellerpage/single-order/${item.order}`}>
      <div className={classes.NotificationItemCont}>
        <div className={classes.date}>{now}</div>

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
      </div>
    </a>
  );
}
