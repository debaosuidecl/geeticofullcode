import React from 'react';
// import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import classes from './Footer.module.css';
import App from '../../../App';
const FooterPage = () => {
  return (
    <React.Fragment>
      <div className={classes.FooterPage}>
        <div className={classes.firstcatCont}>
          <h2>Geetico</h2>
          <p>
            Your Online Superstore for grocery, packaged food items and every of
            your household shopping. We help you save the stress from the whole
            Lagos traffic, also save you the time to shop and most importantly
            save money by giving you the best deal because all of our products
            are offered to you at wholesale price. You can even make custom
            orders because our mission is to go the extra mile for you!!! Shop
            Geetico🛍 !!!
          </p>
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
          <a href={`https://instagram.com/geetico_?igshid=1wo9h9gjyp6br`}>
            Instagram
          </a>
          <a
            href={`https://m.facebook.com/Geetico/?msite_modal=composer&notif_t=aymt_simplified_make_page_post&notif_id=1579188592731743&ref=m_notif`}
          >
            Facebook
          </a>
          <a href={`https://twitter.com/geetico_?s=20`}>Twitter</a>
        </div>
        <div className={classes.catCont}>
          <strong>Legal</strong>
          <a href={`/terms`}>Terms & Conditions</a>
          <a href={`/privacy-policy`}>Privacy</a>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FooterPage;
