import React, { Component } from "react";
import AdImage from "../../shared/images/adexample.jpg";
import classes from "./AdContainer.module.css";

class AdContainer extends Component {
  render() {
    return (
      <div className={classes.AdContainer}>
        <img src={AdImage} alt="AdImage" />
      </div>
    );
  }
}

export default AdContainer;
