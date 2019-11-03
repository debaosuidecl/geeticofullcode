import React from "react";
import classes from "./SellerBackendCards.module.css";
const SellerBackendCards = props => {
  return (
    <div className={classes.SellerBackendCards}>
      <header className={classes.Header}>
        <h4 className={classes.Title}>{props.title}</h4>
      </header>

      <div className={classes.ImageContainer}>
        <img src={props.imageLink} alt="" />
      </div>

      <hr />
      <div className={classes.TextContainer}>
        <p className={classes.Description}>{props.desc}</p>
        <button onClick={props.buttonClicked}>{props.buttonTitle}</button>
        {/* <h4 className={classes.Price}>&#8358;{props.Price}</h4>
        <h6 className={classes.Discount}>{props.Discount} Off</h6> */}
      </div>
    </div>
  );
};

export default SellerBackendCards;
