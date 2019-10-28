import React from 'react';
import classes from './CustomerDetailComponent.module.css';
import App from '../../App';
// import validator from "simple-react-validator";
import DatePicker from 'react-datepicker';
// import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
const CustomerDetailComponent = ({
  state,
  city,
  suite,
  street,
  phone,
  company,
  orderNote,
  changeHandler,
  startDate,
  setStartDate,
  time
}) => {
  return (
    <div className={classes.CustomerDetailCont}>
      <div className={classes.Row}>
        <div className={classes.Col}>
          <label htmlFor='street'>
            Street Address <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type='text'
            value={street}
            onChange={changeHandler}
            id='street'
            placeholder='House Number and Street Name'
          />
        </div>
        <div className={classes.Col}>
          <label htmlFor='suite'></label>
          <input
            type='text'
            id='suite'
            value={suite}
            onChange={changeHandler}
            placeholder='Apartment, suite, unit etc (optional)'
          />
        </div>
      </div>

      {/*  */}
      <div className={classes.Row}>
        <div className={classes.Col}>
          <label htmlFor='street'>
            State <span style={{ color: 'red' }}>*</span>
          </label>
          {/* <select name="" id="" value="Lagos">
             <option value="Lagos">Lagos</option>
           </select> */}
          <input
            type='text'
            id='state'
            onChange={changeHandler}
            title='Deliveries limited to Lagos State for now'
            disabled
            value={state}
          />
        </div>
        <div className={classes.Col}>
          <label htmlFor='city'>
            {' '}
            Town/City <span style={{ color: 'red' }}>*</span>
          </label>
          <select id='city' value={city} onChange={changeHandler}>
            <option value=''>City</option>
            {App.lagos.map(lga => (
              <option key={lga}>{lga}</option>
            ))}
          </select>
        </div>
      </div>

      {/*  */}
      <div className={classes.Row}>
        <div className={classes.Col}>
          <label htmlFor='phone'>
            Phone <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type='text'
            value={phone}
            onChange={changeHandler}
            id='phone'
            placeholder='Enter Phone Number'
          />
        </div>
        <div className={classes.Col}>
          <label htmlFor='company'>Company (optional)</label>
          <input
            type='text'
            id='company'
            value={company}
            onChange={changeHandler}
            placeholder='Apartment, suite, unit etc (optional)'
          />
        </div>
      </div>
      {/*  */}
      <div className={classes.Row}>
        <div className={classes.Col}>
          <label htmlFor='date'>
            Delivery date <span style={{ color: 'red' }}>*</span>
          </label>
          <DatePicker
            selected={startDate}
            id='date'
            onChange={date => {
              let isoDate = new Date(date);
              setStartDate(isoDate);
            }}
            minDate={new Date().setDate(new Date().getDate() + 1)}
            // maxDate={addDays(new Date(), 10 ^ 1000000)}
            placeholderText='Set delivery date'
          />
        </div>

        <div className={classes.Col}>
          <label htmlFor='time'>
            {' '}
            Delivery time-range <span style={{ color: 'red' }}>*</span>
          </label>
          <select id='time' value={time} onChange={changeHandler}>
            <option value=''>--Select time range --</option>
            {App.hours.map(h => (
              <option value={h.value} key={h.value}>
                {h.displayValue}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/*  */}
      <div className={classes.Row}>
        <div className={classes.Col}>
          <label htmlFor='orderNote'> Order note (optional)</label>
          <textarea
            placeholder='Leave a special note about this order'
            name=''
            onChange={changeHandler}
            id='orderNote'
            value={orderNote}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailComponent;
