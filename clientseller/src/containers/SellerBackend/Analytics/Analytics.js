import React, { Component } from "react";
import SellerBackendLayout from "../../../components/UI/sellerBackendLayout/sellerBackendLayout";
import classes from "./Analytics.module.css";
export class Analytics extends Component {
  render() {
    return (
      <SellerBackendLayout>
        <div className={classes.DashboardContainer}>
          <h2>Your Analytics</h2>
          <p>
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error
            tenetur iste excepturi, quaerat minus aliquid tempora ipsa eos, qui,
            assumenda nulla natus. Dolorum facilis harum fuga nemo maxime qui
            beatae?
          </p>
          <p>
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error
            tenetur iste excepturi, quaerat minus aliquid tempora ipsa eos, qui,
            assumenda nulla natus. Dolorum facilis harum fuga nemo maxime qui
            beatae?
          </p>
          <p>
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error
            tenetur iste excepturi, quaerat minus aliquid tempora ipsa eos, qui,
            assumenda nulla natus. Dolorum facilis harum fuga nemo maxime qui
            beatae?
          </p>
        </div>
      </SellerBackendLayout>
    );
  }
}

export default Analytics;
