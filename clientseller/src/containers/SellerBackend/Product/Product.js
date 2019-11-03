import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
// import ProductContainer from "../../../components/ProductSummary/ProductSummary";
import classes from './Product.module.css';
import Modal from '../../../components/UI/Modal/Modal';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProductSummary from '../../../components/ProductSummary/ProductSummary';
import { fetchUserProducts } from '../../../store/actions/products';

import { Helmet } from 'react-helmet';
import AreYouSureToDelete from '../../../components/AreYouSureToDelete/AreYouSureToDelete';
import SpinnerTwo from '../../../components/UI/Spinner2/Spinner2';
import { authCheckOnContainer } from '../../../store/actions/auth';
import App from '../../../App';

export class Products extends Component {
  state = {
    show: false,
    productToDelete: null,
    loading: false
    // showModal
  };
  componentDidMount() {
    this.props.checkAuth();
    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
    this.props.onFetchUserProducts();
  }
  toggleModal = () => {
    this.setState(pState => {
      return {
        show: false
      };
    });
  };
  toDetailPage = summ => {};
  deleteStartHandler = productId => {
    let productToDelete = this.props.products.filter(
      prod => prod._id === productId
    )[0];
    this.setState({
      productToDelete,
      show: true
    });

    console.log(productToDelete);
  };
  deleteImageHandlerAfterConfirmation = async () => {
    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
    let config = {
      headers: {
        'x-auth-token': token
      }
    };

    this.setState({
      loading: true
    });

    axios
      .delete(
        `${App.domain}api/upload/deleteAll/${this.state.productToDelete._id}`,
        config
      )
      .then(res => {
        console.log(res.data);
        this.setState({
          show: false,
          loading: false
        });

        this.props.onFetchUserProducts();
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        console.log(error.response);
        alert(
          `An error occured While deleting this product please try again later`
        );
      });
  };
  render() {
    let productSummary = 'No Products Uploaded Yet';
    // if (this.props.products.length !== 0) {
    productSummary = this.props.products.map(summ => (
      <ProductSummary
        toDetailPage={() => {
          this.props.history.push(
            `/sellerpage/products/productdetail/${summ._id}`
          );
        }}
        deleteStartHandler={this.deleteStartHandler}
        key={summ._id}
        title={summ.productName}
        quantity={summ.productQuantity}
        productId={summ._id}
        price={summ.price}
        icon={faTrash}
        src={App.domain + 'public/' + summ.productURL[[0]]}
      />
    ));
    // }
    return (
      <SellerBackendLayout>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Product Display Page</title>
          {/* <link rel='canonical' href='http://mysite.com/example' /> */}
        </Helmet>

        <Modal show={this.state.show} removeModal={this.toggleModal}>
          {/* Delete Product {JSON.stringify(this.state.productToDelete)} */}
          {this.state.productToDelete ? (
            <AreYouSureToDelete
              name='this Product'
              imageUrl={`${App.domain}public/${
                this.state.productToDelete.productURL[0]
              }`}
              finalDelete={this.deleteImageHandlerAfterConfirmation}
              toggleModal={this.toggleModal}
            />
          ) : null}
        </Modal>
        <div className={classes.DashboardContainer}>
          <h2 className={classes.Title}>Products</h2>
          {this.state.loading ? <SpinnerTwo /> : null}
          <div className={classes.AddProductHeader}>
            <h2>My Products</h2>
            <button
              className={classes.desktopOnly}
              onClick={() =>
                this.props.history.push('/sellerpage/products/addnewproduct')
              }
            >
              Add a Product <FontAwesomeIcon icon={faPlusCircle} size='1x' />
            </button>
            <span
              className={[classes.mobileOnly, classes.addCircle].join(' ')}
              onClick={() =>
                this.props.history.push('/sellerpage/products/addnewproduct')
              }
            >
              >
              <FontAwesomeIcon icon={faPlusCircle} size='1x' />
            </span>
          </div>
          {/* <div className={classes.Body}> */}
          <div className={classes.ProductBody}>
            <div
              className={[classes.ProductHeading, classes.desktopOnlyFlex].join(
                ' '
              )}
            >
              <h6>Product </h6>
              <h6>Name</h6>
              <h6>Quantity</h6>
              <h6>Price</h6>
            </div>
            <div
              className={classes.ProductSummaryCont}
              // style={{ overflowY: "scroll", height: "200px" }}
            >
              {this.props.loadingProduct ? <Spinner /> : productSummary}
            </div>

            {/* </div> */}
          </div>
        </div>
      </SellerBackendLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    products: state.prod.products,
    loadingProduct: state.prod.loadingProduct
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onFetchUserProducts: () => dispatch(fetchUserProducts()),
    checkAuth: () => dispatch(authCheckOnContainer())
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Products)
);
