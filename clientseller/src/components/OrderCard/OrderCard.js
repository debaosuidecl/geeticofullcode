import React, { useState } from 'react';
import classes from './OrderCard.module.css';
import moment from 'moment';
import axios from 'axios';
// import {useState} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import App from '../../App';
// import Backdrop from '../UI/Backdrop/Backdrop';
// import Spinner from '../UI/Spinner/Spinner';
// import App from '../../App';
function OrderCard({ order, isForcedCollapse, setLoadingHandler, history }) {
  const [isCollapsed, collapseHandler] = useState(false);
  const [statusValue, statusChangeHandler] = useState(order.status);
  // const [isLoading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoadingHandler();
  // }, []);
  // let loadingStage = (
  //   <div className=''>
  //     <Backdrop show forceWhite />

  //     <div className={classes.spinnerCont}>
  //       <Spinner />
  //     </div>
  //   </div>
  // );
  const statusChangeAsync = async e => {
    setLoadingHandler();

    const token = localStorage.getItem('token');

    if (!token) {
      return console.log('no access');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    try {
      let firstresp = await axios.post(
        `${App.domain}api/userorders/all/statusChange/${order._id}`,
        {
          status: e.target.value
        },
        config
      );
      console.log(firstresp);
      statusChangeHandler(firstresp.data.status);
      setLoadingHandler();
    } catch (error) {
      console.log(error);
      setLoadingHandler();
    }
  };
  return (
    <div
      className={classes.OrderCard}
      style={{ background: isForcedCollapse ? '#fff' : 'none' }}
    >
      <div className={classes.NamePriceCont}>
        <h2>{order.fullName}</h2>
        <h2>
          &#x20A6;{' '}
          {parseFloat((order.amount / 100).toString().replace(/,/g, ''))
            .toFixed(0)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </h2>
      </div>

      <div className={classes.OrderTop}>
        <div className={classes.Left}>
          <div className={classes.Price}></div>

          <React.Fragment>
            <p className={classes.subCont}>
              <span className={classes.title}>Delivery: </span>{' '}
              <span className={classes.value}>
                {moment(new Date(order.dateOfDelivery))
                  .add(App.valueToHours(order.timeOfDelivery), 'hours')
                  .format('L')}
              </span>
            </p>
            <p className={classes.subCont}>
              <span className={classes.title}>Time: </span>{' '}
              <span className={classes.value}>
                {moment(new Date(order.dateOfDelivery))
                  .add(App.valueToHours(order.timeOfDelivery), 'hours')
                  .format('h:mm a')}
              </span>
            </p>
          </React.Fragment>
          {/* ) : null} */}

          <p className={classes.subCont}>
            <span className={classes.title}>Ordered: </span>{' '}
            {/* {moment(new Date(order.dateOfDelivery)).fromNow()} */}
            <span className={classes.value}>
              {' '}
              {moment(new Date(order.date)).format('L')}
            </span>
          </p>

          <p className={classes.subCont}>
            <span className={classes.title}>Status: </span>{' '}
            <select
              className={classes.Status}
              onChange={statusChangeAsync}
              value={statusValue}
            >
              <option value={order.status}>{order.status}</option>
              {[
                'processing',
                'shipped',
                'delivered',
                'awaiting verification',
                'verification in progress',
                'verification rejected'
              ]
                .filter(status => status !== order.status)
                .map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
            </select>
            {/* </span> */}
          </p>
        </div>
        <div className={classes.Right}>
          {isForcedCollapse ? null : (
            <FontAwesomeIcon
              rotation={isCollapsed ? 180 : null}
              color='#444'
              style={{ transition: '.2s' }}
              size='2x'
              icon={faCaretUp}
              onClick={() => collapseHandler(!isCollapsed)}
            />
          )}
        </div>
      </div>
      <div
        className={classes.collapsible}
        style={{
          // maxHeight: isCollapsed ? '200px' : '0px'
          // minHeight: isCollapsed ? '0px' : '200px'
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
        <div className={classes.UserData}>
          <h2>User Details</h2>
          {[
            { title: 'Phone Number', value: order.phone },
            {
              title: 'Order Type',
              value:
                order.directPaymentMethod === true
                  ? 'Direct Payment'
                  : 'Paystack'
            },
            { title: 'Suite', value: order.suite },
            { title: 'Street', value: order.street },
            { title: 'City', value: order.city },
            { title: 'State', value: 'Lagos State' },
            { title: 'Company', value: order.company },
            { title: 'Transaction Id', value: order.transactionId },
            { title: 'Order Notes', value: order.orderNote }
          ].map((data, i) => (
            <p key={i} className={classes.detCont}>
              <span
                style={{ padding: 10, background: '#eee' }}
                // className={classes.title}
              >
                {data.title}:{' '}
              </span>{' '}
              {data.value ? <span>{data.value}</span> : <span>N/A</span>}
            </p>
          ))}
        </div>

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
            onClick={() =>
              history.push(`/sellerpage/single-order/${order._id}`)
            }
          >
            More Details
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default withRouter(OrderCard);
