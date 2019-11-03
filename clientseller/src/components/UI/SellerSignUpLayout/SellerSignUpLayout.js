import React from 'react';
import classes from './SellerSignUpLayout.module.css';
// import Header from '../../HeaderSeller/HeaderSeller';
import HeaderSeller from '../../HeaderSeller/HeaderSeller';
// import { Link } from 'react-router-dom';
// import Toolbar from '../../Toolbar/Toolbar';
const SellerSignUpLayout = props => {
  // let levelWidth = "0%";
  // let circleSecondColor = "#ccc";
  // let circleThirdColor = "#ccc";
  // if (props.isSecondLevel) {
  //   levelWidth = "50%";
  //   circleSecondColor = "orange";
  // }
  // if (props.isThirdLevel) {
  //   levelWidth = "100%";
  //   circleThirdColor = "orange";
  //   circleSecondColor = "orange";
  // }
  return (
    <div className={classes.SellerSignUpLayout}>
      {/* <Toolbar /> */}
      <HeaderSeller signupHeader navItems={{ navItems: null }} />
      {/* <h1 className={classes.Header}>Geetico</h1>
      <h3 className={classes.SubHeader}>{props.subHeader}</h3> */}
      <div className={classes.bar}>
        {/* <div style={{ margin: '40px auto', textAlign: 'center' }}>
          <Link to='/'> &#x2190; Back To Product Page</Link>
        </div> */}
        {/* <div className={classes.Level} style={{ width: levelWidth }} /> */}
        <div
          // style={{ background: "orange", boxShadow: "none" }}
          className={classes.circleOne}
        >
          {/* <p>1</p> */}
        </div>
        <div
          className={classes.circleTwo}
          // style={{ background: circleSecondColor }}
        />
      </div>
      {/* <hr /> */}
      <div>{props.children}</div>
    </div>
  );
};

export default SellerSignUpLayout;
