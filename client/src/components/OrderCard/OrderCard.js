import React, { useState } from 'react';
import classes from './OrderCard.module.css';
import moment from 'moment';
// import {useState} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import App from '../../App';
// import App from '../../App';
function OrderCard({ order, history, isForcedCollapse }) {
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
              <span className={classes.title}>delivery:</span>{' '}
              <span className={classes.value}>
                {moment(new Date(order.dateOfDelivery))
                  .add(App.valueToHours(order.timeOfDelivery), 'hours')
                  .fromNow()}
              </span>
            </p>
          ) : null}

          <p className={classes.subCont}>
            <span className={classes.title}>Ordered: </span>{' '}
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
          transform: isForcedCollapse
            ? 'rotateX(0deg)'
            : !isCollapsed
            ? 'rotateX(90deg)'
            : 'rotateX(0deg)',
          maxHeight: isForcedCollapse
            ? '100000px'
            : !isCollapsed
            ? '0px'
            : '10000px'
        }}
      >
        {order.orderDetails.map((p, i) => {
          return (
            <div key={i} className={classes.orderData}>
              <span>
                <span
                  // onClick={() => history.push(`/details/${p.fullProduct._id}`)}
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
        {!isForcedCollapse ? (
          <p
            className={classes.More}
            onClick={() => history.push(`/single-order/${order._id}`)}
          >
            More Details
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default withRouter(OrderCard);
