import React, { useState } from 'react';
import classes from './OrderCard.module.css';
import moment from 'moment';
// import {useState} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import App from '../../App';
// import App from '../../App';
function OrderCard({ order, history }) {
  const [isCollapsed, collapseHandler] = useState(false);
  return (
    <div
      className={classes.OrderCard}
      onClick={() => collapseHandler(!isCollapsed)}
    >
      <div className={classes.OrderTop}>
        <div className={classes.Left}>
          <div className={classes.Price}>
            <h2>
              &#x20A6;{' '}
              {parseFloat((order.amount / 100).toString().replace(/,/g, ''))
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </h2>
          </div>

          {order.status !== 'delivered' ? (
            <p className={classes.subCont}>
              <span className={classes.title}>delivery</span>{' '}
              <span className={classes.value}>
                {moment(new Date(order.dateOfDelivery))
                  .add(App.valueToHours(order.timeOfDelivery), 'hours')
                  .fromNow()}
              </span>
            </p>
          ) : null}

          <p className={classes.subCont}>
            <span className={classes.title}>Ordered </span>{' '}
            {/* {moment(new Date(order.dateOfDelivery)).fromNow()} */}
            <span className={classes.value}>
              {' '}
              {moment(new Date(order.date)).fromNow()}
            </span>
          </p>
          {/* <p className={classes.subCont}>
            <span className={classes.title}>transaction ID:</span>{' '}
            <span className={classes.value}>{order.transactionId}</span>
          </p> */}
          <p className={classes.subCont}>
            <span className={classes.title}>status:</span>{' '}
            <span
              className={
                order.status === 'delivered'
                  ? [classes.value, classes.delivered].join(' ')
                  : order.status === 'shipped'
                  ? [classes.value, classes.shipped].join(' ')
                  : classes.value
              }
            >
              {order.status}
            </span>
          </p>
        </div>
        <div className={classes.Right}>
          <FontAwesomeIcon
            rotation={isCollapsed ? 180 : 0}
            color='#444'
            style={{ transition: '.2s' }}
            size='2x'
            icon={faCaretUp}
            onClick={() => collapseHandler(!isCollapsed)}
          />
        </div>
      </div>
      <div
        className={classes.collapsible}
        style={{
          // maxHeight: isCollapsed ? '200px' : '0px'
          // minHeight: isCollapsed ? '0px' : '200px'
          transform: !isCollapsed ? 'rotateX(90deg)' : 'rotateX(0deg)',
          maxHeight: !isCollapsed ? '0px' : '500px'
        }}
      >
        {order.orderDetails.map((p, i) => {
          return (
            <div key={i} className={classes.orderData}>
              <span>
                <span
                  onClick={() => history.push(`/details/${p.fullProduct._id}`)}
                  className={classes.productName}
                >
                  {p.productName}
                </span>{' '}
                X <span className={classes.quantity}> {p.quantity}</span>
              </span>
              <span className={classes.price}>&#x20A6; {p.price}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withRouter(OrderCard);
