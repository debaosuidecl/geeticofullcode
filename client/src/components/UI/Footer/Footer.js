import React from 'react';
// import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import classes from './Footer.module.css';
import App from '../../../App';
const FooterPage = () => {
  return (
    <React.Fragment>
      <div className={classes.FooterPage}>
        <div className={classes.catCont}>
          <h2>Geetico</h2>
          <p>We deliver the tastiest groceries to your doorstep.</p>
        </div>
        <div className={classes.catCont}>
          <strong>Categories</strong>
          {App.allowedCategories.map(category => {
            return (
              <a key={category} href={`/category/${category}`}>
                {category}
              </a>
            );
          })}
        </div>
        <div className={classes.catCont}>
          <strong>Social</strong>
          <a href={`/`}>Instagram</a>
          <a href={`/`}>Facebook</a>
          <a href={`/`}>Twitter</a>
        </div>
        <div className={classes.catCont}>
          <strong>Legal</strong>
          <a href={`/`}>Terms & Conditions</a>
          <a href={`/`}>Privacy</a>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FooterPage;
