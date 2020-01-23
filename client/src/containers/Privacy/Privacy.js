import React, { Component } from 'react';
import Layout from '../../components/UI/Layout/Layout';
import classes from './Privacy.module.css';

class Privacy extends Component {
  render() {
    return (
      <Layout>
        <div className={classes.Privacy}>
          <div className={classes.Header}>
            <h2>Our Privacy Policy</h2>
          </div>
          <p>
            Privacy Policy. Principal The safety and privacy of personal data
            has a special value for Geetico.com. The collection, processing and
            usage of personal data shall only be undertaken with the consent of
            the individual or due to a legal obligation.
          </p>
          <p>
            Should anonymous or pseudonymous data be needed for business
            purposes, then only these forms of data shall be used. Personal data
            stored at Geetico is protected by extensive technical and
            operational safeguards against potential unauthorized access or
            abuse. Our security procedures are regularly reviewed along with the
            latest technological developments. Orders and Membership We collect;
            store; modify; use and transmit personal data for their own specific
            purposes towards the justification and settlement of the user’s
            contract or contract relationships, including individual and
            personal customer advice and support, and to protect the legitimate
            business interests of Geetico.
          </p>
          <p>
            When necessary, we will transmit personal data to third parties
            (such as delivery companies). Only information that is needed to
            carry out its task will be transmitted and used. The usage and
            transmission of personal data for advertising and market-research
            purposes is permitted by Geetico, unless the user asks us to
            withhold their personal information when setting up their contract
            with us. Users can opt-out of the usage of their data at any time
            within their Geetico user-account or by sending a request via email
            to contact@geetico.com.
          </p>
          <p>
            The usage of personal data for other appropriate purposes is
            dependent on prior consent from the user. If a user agrees to the
            forwarding of newsletters, then they will receive the newsletter
            content via Geetico. Usage of Online Offers Geetico collects and
            uses personal user data due to legal obligations or when permission
            from a user is given, for the reason of content-wise alterations or
            changes to the contractual relations with the user in terms of the
            usage of tele-media. As far as is necessary, Geetico collects and
            uses a personal data in order to enable users to operate their
            online service; for accounting; further legally permissible cases or
            with the users consent. Geetico collects and uses data contained in
            log-files that the user’s internet browser transmits to us. The data
            we receive is the user’s browser type/version; operating system;
            referring URLs (the user’s previously visited site); hostname (IP
            address) of the accessing computer and the time of server inquiry.
            In order to ensure the safe communication of the Geetico online
            service – it is not necessary for Geetico to use the data collected
            in connection with the specific user. Therefore, after statistical
            evaluation the data will be deleted and not used in connection with
            the user. Geetico uses Google Maps auto-completion APIs to verify
            your delivery information and avoid delivery errors. When you add
            your delivery information, you agree with Google Maps’ Terms of
            Service and Google’s Privacy Policy. Usage of Cookies For the reason
            of improving Geetico’s online service, the commonly-named system of
            ‘Cookies’ are used. Cookies are text files, which are stored on a
            user’s computer when they visit a website. Cookies are used either
            once or over a longer period of time to use a user’s recurring
            attitudes within the Geetico site to their benefit – in terms of
            personalising the Geetico online experience and its functions and
            tools towards individual user’s needs. The text files contain no
            address data (i.e. user’s names and E-Mail data) or other personal
            information. Geetico will not link data found in these text files
            with other data sources. Cookies serve to further our analysis of
            web-page usage and enables us to make our service more
            user-friendly; more effective and safer. Deactivation of Cookies
            Users can set their web browser to halt the storage of the data
            files known as Cookies. In some cases this can lead to certain
            services and website functions to become unusable. User Rights to
            Access to Personal Information Visitors and users of Geetico’s web
            page can request (free of charge) access to any information held
            about them and its origin; any recipients of their data and the
            reason for the storage of such data.
          </p>
        </div>
      </Layout>
    );
  }
}

export default Privacy;
