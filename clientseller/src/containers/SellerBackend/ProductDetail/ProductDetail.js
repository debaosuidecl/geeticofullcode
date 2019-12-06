import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import AreYouSureToDelete from '../../../components/AreYouSureToDelete/AreYouSureToDelete';
import SpinnerTwo from '../../../components/UI/Spinner2/Spinner2';
import Modal from '../../../components/UI/Modal/Modal';
import classes from './ProductDetail.module.css';
import { withRouter } from 'react-router-dom';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchUserProducts } from '../../../store/actions/products';
import { Helmet } from 'react-helmet';
import ProductDetailCard from '../../../components/ProductDetailCard/ProductDetailCard';
import Error404 from '../../Error404/Error404';
import { authCheckOnContainer } from '../../../store/actions/auth';
import App from '../../../App';

export class Products extends Component {
  state = {
    show: false,
    loading: true,
    productDetail: '',
    success: false,
    selectLink: '',
    imagePreviewOpen: false,
    formValidity: true,
    showInput: false,
    searchTagConfigValue: '',
    imageToDelete: '',
    indextodelete: '',
    showModal: false,
    isUpdating: false,
    reviewArray: [],
    userDataArray: []
  };

  componentWillMount() {
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
  }

  componentDidMount() {
    this.props.checkAuth();
    this.initDetailFetch();
  }
  initDetailFetch = () => {
    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    axios
      .get(
        `${App.domain}api/upload/details/${this.props.match.params.productId}`,
        config
      )
      .then(response => {
        console.log(response.data);

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
  initiateUpdateHandlerOnDoubleClick = () => {
    // console.log('editing');
    this.setState(prevState => {
      return {
        showInput: !prevState.showInput
      };
    });
  };
  onEditChangeHandler = e => {
    // console.log(e.target.value);
    this.setState({
      productDetail: {
        ...this.state.productDetail,
        [e.target.name]: e.target.value
      },
      formValidity:
        this.validator.fields.productName &&
        this.validator.fields.price &&
        this.validator.fields.description &&
        this.validator.fields.productQuantity
      // this.validator.fields.referenceNumber
    });
  };
  updateHandler = () => {
    // console.log('updatedFields', this.state.productDetail);
    this.setState({ isUpdating: true });
    console.log(this.validator.fields.productName, 'prod');
    console.log(this.validator.fields.price, ' price');
    console.log(this.validator.fields.description, 'desc');
    console.log(this.validator.fields.productQuantity, 'prod');
    if (
      !this.validator.fields.productName ||
      !this.validator.fields.price ||
      !this.validator.fields.description ||
      !this.validator.fields.productQuantity
      // !this.validator.fields.referenceNumber
    ) {
      console.log('not valid');
      return;
    }
    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    axios
      .post(
        `${App.domain}api/upload/edit/${this.props.match.params.productId}`,
        this.state.productDetail,
        config
      )
      .then(response => {
        console.log(response.data);
        this.setState({
          showInput: false,
          isUpdating: false
        });
      })
      .catch(errors => {
        alert('Error Editing Product, Please try again later');
        console.log(errors.response);
        this.setState({
          isUpdating: false
        });
        // console.log(errors.response.data);
        // this.setState({ loading: false, productDetail: errors.response.data });
      });
  };
  onInputTagChangeHandler = e => {
    this.setState({
      searchTagConfigValue: e.target.value
    });

    // console.log(e.target.value.split('').find(l => l === ','), 'if comma');
    if (
      e.target.value.split('').find(l => l === ',') &&
      e.target.value.length > 1
    ) {
      let tags = this.state.productDetail.tags.concat(
        e.target.value.substring(0, e.target.value.length - 1)
      );
      this.setState({
        searchTagConfigValue: '',
        productDetail: { ...this.state.productDetail, tags: tags }
        // searchTagConfig: { ...this.state.searchTagConfig, value: '', tags }
      });
    }
  };
  deleteTagHandler = indextodelete => {
    let prevTags = [...this.state.productDetail.tags];
    // console.log(indextodelete);
    let tags = prevTags.filter((tag, i) => i !== indextodelete);
    this.setState({
      productDetail: {
        ...this.state.productDetail,
        tags
      }
    });
  };

  deleteImageHandlerStart = indextodelete => {
    if (this.state.productDetail.productURL.length <= 1) {
      // return console.log('Images are required');
    }
    // console.log('delete me', indextodelete);
    const urlToDelete = this.state.productDetail.productURL[indextodelete]; // will unlink this url with nodeJS
    this.setState({
      imageToDelete: urlToDelete,
      indextodelete
    });
    this.showModalHandler();
  };

  deleteImageHandlerAfterConfirmation = async () => {
    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
    let config = {
      headers: {
        'x-auth-token': token
      }
    };

    // console.log('deleted');
    this.setState({
      isUpdating: true
    });

    axios
      .delete(
        `${App.domain}api/upload/deleteImage/${this.state.productDetail._id}/${this.state.imageToDelete}`,
        config
      )
      .then(res => {
        this.setState({
          showModal: false,
          isUpdating: false
        });
        let imageArray = [...this.state.productDetail.productURL];
        let productURL = imageArray.filter((img, i) => {
          return i !== this.state.indextodelete;
        });
        this.setState({
          productDetail: {
            ...this.state.productDetail,
            productURL
          },

          indextodelete: '',
          imageToDelete: '',
          selectLink: productURL[0]
        });
        // console.log('successful deletion');
      })
      .catch(error => {
        this.setState({
          isUpdating: false
        });
        // console.log(error.response);
        alert(
          `An error occured While deleting this image please try again later \n ${error.response.errors.msg}`
        );
      });
  };
  showModalHandler = () => {
    // console.log("I'm trying here");
    this.setState(prevState => {
      return {
        showModal: !prevState.showModal
      };
    });
  };
  onAddNewImageHandler = e => {
    e.preventDefault();
    this.setState({
      isUpdating: true
    });
    let reader = new FileReader();
    let file = e.target.files[0];
    // console.log(file);
    // return;

    reader.onprogress = data => {
      // console.log(data);
      if (data.lengthComputable) {
        // var progress = parseInt((data.loaded / data.total) * 100, 10);
        // console.log(progress);
      }
    };
    reader.onloadend = () => {
      let formData = new FormData();

      formData.append('myImages', file);
      // console.log(formData);
      let token = localStorage.getItem('token');
      if (!token) return this.props.history.push('/');
      let config = {
        headers: {
          'content-type': 'multipart/form-data',
          'x-auth-token': token
        }
      };
      axios
        .post(
          `${App.domain}api/upload/addImage/${this.state.productDetail._id}`,
          formData,
          config
        )
        .then(response => {
          // console.log(response.data);
          this.setState({
            isUpdating: false,
            productDetail: {
              ...this.state.productDetail,
              productURL: [
                ...this.state.productDetail.productURL,
                response.data.msg
              ]
            }
          });
          // alert('The file is successfully uploaded');
          // dispatch(productAdd(userId, productInfo));
        })
        .catch(error => {
          this.setState({
            isUpdating: false
          });
          // console.log(error.response);
          alert('A problem occured with adding this product');
        });
    };

    if (file && file.type.match('image.*')) {
      reader.readAsDataURL(file);
    } else {
      return;
    }
  };
  render() {
    // console.log(this.state.productDetail.productName);
    return (
      <SellerBackendLayout>
        <Modal show={this.state.showModal} removeModal={this.showModalHandler}>
          {this.state.isUpdating ? <SpinnerTwo /> : null}
          <AreYouSureToDelete
            name='this image'
            imageUrl={`${App.domain}public/${this.state.imageToDelete}`}
            finalDelete={this.deleteImageHandlerAfterConfirmation}
            toggleModal={this.showModalHandler}
          />
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
                isEditable
                updateHandler={this.updateHandler}
                selectLink={this.state.selectLink}
                setActiveLink={this.setActiveLink}
                previewOpen={this.state.imagePreviewOpen}
                previewOpenHandler={this.previewOpenHandler}
                details={this.state.productDetail}
                validator={this.validator}
                onEditChange={this.onEditChangeHandler}
                startEdit={this.initiateUpdateHandlerOnDoubleClick}
                showInput={this.state.showInput}
                isUpdating={this.state.isUpdating}
                formValidity={!this.state.formValidity || this.state.isUpdating}
                onInputTagChangeHandler={this.onInputTagChangeHandler}
                searchTagConfigValue={this.state.searchTagConfigValue}
                deleteTagHandler={this.deleteTagHandler}
                keyPressHandler={this.keyPressHandler}
                deleteImageHandler={this.deleteImageHandlerStart}
                onAddNewImage={this.onAddNewImageHandler}
                userDataArray={this.state.userDataArray}
              />
            </div>
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
