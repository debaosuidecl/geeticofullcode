import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import classes from './Home.module.css';
import ProductIcon from '../../../shared/images/productIcon2.png';
import ProductCardIcon from '../../../shared/images/productIcon1.png';
import OrderManagementIcon from '../../../shared/images/ordermanagement.png';
import Helmet from 'react-helmet';
import { authCheckOnContainer } from '../../../store/actions/auth';
import SellerBackendCards from '../../../components/SellerBackendCards/SellerBackendCards';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import LoadingPage from '../../LoadingPage/LoadingPage';
import App from '../../../App';

export class Home extends Component {
  componentWillMount() {
    this.props.onCheckAuth();
    axios
      .get(`${App.domain}api/users/custom-order-count`)
      .then(res => {
        console.log(res);
        this.setState({ countForCustom: res.data.count });
      })
      .catch(err => {
        console.log(err.response);
      });
  }
  state = {
    countForCustom: 0,
    cardDetails: {
      customers: {
        title: 'Customers',
        desc:
          'Checkout your  customer details such as email address phone number and full name',
        imageLink: ProductIcon,
        navLink: '/sellerpage/customers'
      },
      customOrders: {
        title: 'Custom Orders',
        desc: 'Checkout custom orders',
        imageLink: OrderManagementIcon,
        navLink: '/sellerpage/customproducts'
      },

      Products: {
        title: 'Products',
        desc: 'View, upload and edit product details.',
        imageLink: ProductCardIcon,
        navLink: '/sellerpage/products'
      },
      //
      OrderManagement: {
        title: 'Orders',
        desc:
          'Manage customer orders. change the status of the orders, filter orders by status and so much more.',
        imageLink: OrderManagementIcon,
        navLink: '/sellerpage/order'
      }
    }
  };
  onClickedButtonHandler = card => {
    this.props.history.push(this.state.cardDetails[card].navLink);
  };
  render() {
    const { cardDetails } = this.state;
    let content = (
      <div className={classes.DashboardContainer}>
        <h2>Welcome to Geetico Seller HQ, {this.props.fullName}</h2>
        <hr />

        <div className={classes.Body}>
          <div className={classes.AddProductContainer}>
            {/*  Beginning of Conditional First Product Render */}
            <div className={classes.AddProductHeader}>
              <h2>Start Selling on Geetico</h2>
              {/* <button className={classes.desktopOnly}>Learn How</button> */}
            </div>
            {/* <div className={classes.AddProductCTACont}>
              <div className={classes.ProductImageContainer}>
                <img src={ProductIcon} alt='' />
              </div>
              <div className={classes.AddProductCTA}>
                <h3>Add your first product</h3>
                <p>
                  Start By adding your first product. This can be tangible
                  items, services, downloads or anything at all.
                </p>
                <button
                  onClick={() => {
                    this.props.history.push('/sellerpage/products');
                  }}
                >
                  Add Product
                </button>
              </div>
            </div> */}
            {/*  End of Conditional First Product Render */}
          </div>
          <hr />
          <div className={classes.CardsContainer}>
            {Object.keys(cardDetails).map((card, i) => {
              return (
                <div className={classes.CardsCont} key={i}>
                  <SellerBackendCards
                    title={cardDetails[card].title}
                    desc={cardDetails[card].desc}
                    imageLink={cardDetails[card].imageLink}
                    buttonTitle={`Go to ${cardDetails[card].title}`}
                    buttonClicked={() => {
                      this.onClickedButtonHandler(card);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
    return (
      <SellerBackendLayout>
        <Helmet>
          <title>Geetico seller Portal</title>
        </Helmet>
        {this.props.authCheck ? <LoadingPage /> : null}
        {this.state.countForCustom ? (
          <p
            onClick={() =>
              this.props.history.push('/sellerpage/customproducts')
            }
            className={classes.Custom}
          >
            You have {this.state.countForCustom} unread custom orders
          </p>
        ) : null}
        {this.props.isAuthenticated ? content : null}
      </SellerBackendLayout>
    );
  }
}

const mapStateToProps = state => {
  console.log(state, 'from Home.js');
  return {
    isAuthenticated: state.auth.token !== null,
    fullName: state.auth.fullName,

    authCheck: state.auth.authCheckLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckAuth: () => dispatch(authCheckOnContainer())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
