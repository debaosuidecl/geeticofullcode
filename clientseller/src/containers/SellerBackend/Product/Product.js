import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
// import ProductContainer from "../../../components/ProductSummary/ProductSummary";
import classes from './Product.module.css';
import Modal from '../../../components/UI/Modal/Modal';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import {
  faPlusCircle,
  faTrash,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
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
    loading: false,
    products: [],
    searchTerm: '',
    searchTermDisplay: '',
    page: 2,
    loadingProduct: false,
    hasMore: true,
    searchMode: false
    // showModal
  };
  componentDidMount() {
    this.props.checkAuth();

    this.onFetchUserProducts(true);
  }
  onFetchUserProducts = first => {
    if (first) {
      this.setState({ loadingProduct: true });
    }

    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    let url = this.state.searchMode
      ? `${App.domain}api/userproducts/${this.state.page}?search=${this.state.searchTerm}&`
      : `${App.domain}api/upload/getAll/${
          first === true ? 1 : this.state.page
        }`;

    axios
      .get(url, config)
      .then(response => {
        // this.setState({ products: response.data });
        this.setState({ loadingProduct: false });
        // console.log(response.data)
        this.setState(prevState => {
          return {
            // loading: false,
            loadingProduct: false,
            products: prevState.products.concat(response.data),
            hasMore:
              response.data.length < 25 || response.data.length == 0
                ? false
                : true,
            page: first === false ? prevState.page + 1 : prevState.page
          };
        });
      })
      .catch(error => {
        this.setState({ loadingProduct: false });
      });
  };
  toggleModal = () => {
    this.setState(pState => {
      return {
        show: false
      };
    });
  };
  toDetailPage = summ => {};
  deleteStartHandler = productId => {
    let productToDelete = this.state.products.filter(
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

        this.onFetchUserProducts();
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

  searchChangeHandler = e => {
    this.setState({ searchTerm: e.target.value });
  };
  searchNewHandler = showAll => {
    this.setState({ loadingProduct: true });
    let url = `${App.domain}api/userproducts/1?search=${this.state.searchTerm}`;

    if (showAll === true) {
      url = `${App.domain}api/userproducts/1`;
      this.setState({ searchTermDisplay: '' });
    }
    axios
      .get(url)
      .then(response => {
        // this.setState({ loadingProduct: false });
        this.setState(prevState => {
          return {
            products: [...response.data],
            loadingProduct: false,
            hasMore:
              response.data.length < 25 || response.data.length == 0
                ? false
                : true,
            page: 2,
            searchMode: this.state.searchTerm.length > 0 ? true : false,
            searchTermDisplay: this.state.searchTerm
          };
        });
      })
      .catch(e => {
        console.log(e.response);
      });
  };
  render() {
    let productSummary = 'No Products Uploaded Yet';
    productSummary =
      this.state.products.length > 0 &&
      this.state.products.map((summ, i) => (
        <ProductSummary
          key={i}
          toDetailPage={() => {
            this.props.history.push(
              `/sellerpage/products/productdetail/${summ._id}`
            );
          }}
          deleteStartHandler={this.deleteStartHandler}
          // key={summ._id}
          title={summ.productName}
          quantity={summ.productQuantity}
          productId={summ._id}
          price={summ.price}
          icon={faTrash}
          src={'https://seller.geetico.com/' + 'public/' + summ.productURL[[0]]}
        />
      ));
    let wrapper = !this.state.loadingProduct ? (
      <InfiniteScroll
        dataLength={this.state.products.length}
        next={() => this.onFetchUserProducts(false)}
        hasMore={this.state.hasMore}
        loader={
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <SpinnerTwo />
          </div>
        }
        endMessage={
          <p
            style={{
              textAlign: 'center',
              color: '#333'
            }}
          >
            End of Results
          </p>
        }
      >
        <div className={classes.ProductSummaryCont}>{productSummary}</div>
      </InfiniteScroll>
    ) : (
      <Spinner />
    );

    // if (this.props.products.length !== 0) {

    // }
    return (
      <SellerBackendLayout>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Product Display Page</title>
        </Helmet>
        <Modal show={this.state.show} removeModal={this.toggleModal}>
          {this.state.productToDelete ? (
            <AreYouSureToDelete
              name='this Product'
              imageUrl={`${App.domain}public/${this.state.productToDelete.productURL[0]}`}
              finalDelete={this.deleteImageHandlerAfterConfirmation}
              toggleModal={this.toggleModal}
            />
          ) : null}
        </Modal>

        <div className={classes.DashboardContainer}>
          <div
            className={classes.SearchBarFloatingButton}
            onClick={() => {
              window.scrollTo(0, 0);
              document.querySelector('[name="product_search"]').focus();
              // document.querySelector('[name="product_search"]').();
            }}
          >
            <FontAwesomeIcon icon={faSearch} size='2x' color='white' />
          </div>
          {/* <h2 className={classes.Title}>Products</h2> */}
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
          <div className=''>
            <form
              className={classes.SearchInputCont}
              onSubmit={e => {
                e.preventDefault();
                this.searchNewHandler();
              }}
            >
              <input
                onChange={this.searchChangeHandler}
                value={this.state.searchTerm}
                // onFocus={() => console.log(this.setState())}
                name='product_search'
                type='text'
                placeholder='Search for a product, category or tag'
              />
              {this.state.searchMode ? (
                <p
                  className={classes.showAll}
                  onClick={() => {
                    this.setState({
                      searchTerm: '',
                      searchTermDisplay: '',
                      searchMode: false
                    });

                    this.searchNewHandler(true);
                    // this.onFetchUserProducts(true);
                  }}
                >
                  Show All
                </p>
              ) : null}
              <FontAwesomeIcon
                icon={faFilter}
                style={{
                  color: this.state.searchMode ? '#6ce001' : '#555'
                }}
                onClick={this.searchNewHandler}
              />
            </form>
          </div>
          {this.state.searchMode && this.state.searchTermDisplay ? (
            <div className=''>
              Showing results for {this.state.searchTermDisplay.toUpperCase()}
            </div>
          ) : null}
          {this.state.products.length <= 0 && !this.state.loadingProduct ? (
            <p className={classes.NoSearchResult}>Search returned No results</p>
          ) : (
            wrapper
          )}
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
  connect(mapStateToProps, mapDispatchToProps)(Products)
);
