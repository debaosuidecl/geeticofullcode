import React, { Component } from 'react';
// import SimpleReactValidator from 'simple-react-validator';
import Layout from '../../components/UI/Layout/Layout';
import SpinnerTwo from '../../components/UI/Spinner2/Spinner2';
import { Link } from 'react-router-dom';
import Modal from '../../components/UI/Modal/Modal';
import classes from './ProductDetail.module.css';
import { withRouter } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import axios from 'axios';
// import { fetchUserProducts } from '../../../store/actions/products';
import { Helmet } from 'react-helmet';
import ProductDetailCard from '../../components/ProductDetailCard/ProductDetailCard';
import Error404 from '../Error404/Error404';
import App from '../../App';
import CarouselCard from '../../components/CarouselCard/CarouselCard';
import { initiateAddToCart } from '../../store/actions/cart';
import { toggleAuthModalAction } from '../../store/actions/auth';
// import { authCheckOnContainer } from '../../../store/actions/auth';

export class Products extends Component {
  state = {
    show: false,
    loading: true,
    productDetail: '',
    success: false,
    selectLink: '',
    imagePreviewOpen: false,
    showModal: false,
    catProducts: [],
    reviewArray: [],
    userDataArray: []
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.initDetailFetch();
  }

  UNSAFE_componentWillReceiveProps(oldProps, newProps) {
    // console.log(oldProps, newProps);
    if (
      newProps.location &&
      oldProps.location.pathname !== newProps.location.pathname
    ) {
      document.querySelector('[href="#TNV"]').click();
    }

    this.initDetailFetch();
  }

  initDetailFetch = () => {
    // console.log(this.props);
    axios
      .get(
        `${App.domain}api/userproducts/details/${this.props.match.params.productId}`
      )
      .then(response => {
        // console.log(response.data);

        Promise.all(
          response.data.reviews.map(review => {
            return new Promise(async (resolve, reject) => {
              let userData = await axios.get(
                `${App.domain}api/userauth/pub/${review.user}`
              );
              resolve(userData);
            });
          })
        ).then(userDataArray => {
          // console.log(userDataArray[0].data);
          this.setState({
            loading: false,
            productDetail: response.data,
            success: true,
            userDataArray,
            selectLink: response.data.productURL[0]
          });
        });
        axios
          .get(
            `${App.domain}api/userproducts/category/${response.data.category}/1`
          )
          .then(res => {
            let suggest = res.data.filter(p => p._id !== response.data._id);
            this.setState({
              catProducts: suggest
            });
          });
      })

      .catch(errors => {
        // console.log(errors.response.data);
        this.setState({ loading: false, productDetail: errors.response.data });
      });
  };
  previewOpenHandler = () => {
    this.setState(prevState => {
      return {
        imagePreviewOpen: !prevState.imagePreviewOpen
      };
    });
  };
  setActiveLink = selectLink => {
    this.setState({ selectLink });
  };

  handleReviewUpdate = (reviews, userDataArray) => {
    //  let indexToUpdate = reviews.findIndex(review=> review.user === this.props.userId)
    let productDetail = {
      ...this.state.productDetail,
      reviews: reviews,
      userDataArray
    };
    this.setState({
      productDetail,
      userDataArray
    });
  };
  render() {
    // console.log(this.state.productDetail.productName);

    return (
      <Layout>
        <a className='toNew' href='/'>
          {' '}
        </a>
        {/* <a href='#TNV'></a> */}
        <Modal show={this.state.showModal} removeModal={this.showModalHandler}>
          {this.state.isUpdating ? <SpinnerTwo /> : null}
        </Modal>
        <meta charSet='utf-8' />
        {this.state.success ? (
          <Helmet>
            <title>
              {this.state.productDetail.productName} Details -{' '}
              {this.state.productDetail.category}{' '}
            </title>
          </Helmet>
        ) : null}
        {/* <link rel='canonical' href='http://mysite.com/example' /> */}

        <div className={classes.ProductDetailContainer}>
          <Link to='/'>Home </Link>
          <div className=''>
            <Link to={`/category/${this.state.productDetail.category}`}>
              {this.state.productDetail.category}
            </Link>
          </div>
          {this.state.loading ? (
            <Spinner />
          ) : Array.isArray(this.state.productDetail) &&
            !this.state.loading &&
            this.state.productDetail.length === 0 ? (
            <Error404 />
          ) : (
            <div className={classes.ProductDetailCont}>
              <h2 className={classes.PageTitle}>Product Details</h2>

              <ProductDetailCard
                // isEditable
                handleUpdate={this.handleReviewUpdate}
                isEditable={false}
                userDataArray={this.state.userDataArray}
                // updateHandler={this.updateHandler}
                selectLink={this.state.selectLink}
                setActiveLink={this.setActiveLink}
                previewOpen={this.state.imagePreviewOpen}
                previewOpenHandler={this.previewOpenHandler}
                details={this.state.productDetail}
              />
            </div>
          )}
        </div>

        {this.state.catProducts.length > 0 ? (
          <React.Fragment>
            <h2 className={classes.PageTitle}>Our Recommendations</h2>
            <div className={classes['scrolling-wrapper']}>
              {this.state.catProducts.length > 0 &&
                this.state.catProducts.map((item, i) => (
                  <span
                    className=''
                    onClick={() => {
                      document.querySelector(
                        '.toNew'
                      ).href = `/details/${item._id}`;
                      document.querySelector('.toNew').click();
                    }}
                  >
                    <CarouselCard
                      hideCart
                      isCarousel
                      productURL={`${App.domain}public/${item.productURL[0]}`}
                      desc={item.desc}
                      productName={item.productName}
                      price={item.price}
                      key={`key-${i}`}
                    />
                  </span>
                ))}
            </div>
          </React.Fragment>
        ) : null}
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddToCart: prodData => dispatch(initiateAddToCart(prodData)),
    onShowAuthModalToggle: () => dispatch(toggleAuthModalAction())
  };
};
const mapStateStateToProps = state => {
  return {
    userId: state.auth._id
  };
};
export default withRouter(
  connect(mapStateStateToProps, mapDispatchToProps)(Products)
);
