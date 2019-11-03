import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import classes from './AddProductContainer.module.css';
import Input from '../../../components/UI/Input/Input';
import InputTags from './InputTag';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import {
  addNewProduct
  // initAddProduct
} from '../../../store/actions/actionIndex';
import { connect } from 'react-redux';
import { Prompt, Redirect } from 'react-router-dom';

import { updateObject, checkValidity } from '../../../shared/utitlity';
import ImagePreview from '../../../components/ImagePreview/ImagePreview';
import { priceQuantCheck, imageParameters } from './helperFunc';
import ImageInput from '../../../components/imageInput/imageInput';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { authCheckOnContainer } from '../../../store/actions/auth';

// import Modal from '../../../components/UI/Modal/Modal';
class AddProductContainer extends Component {
  state = {
    controls: {
      productName: {
        elementType: 'input',

        validateMe: true,
        elementConfig: {
          'data-required': true,
          id: 'name',
          type: 'Product Name',
          placeholder: 'Enter your product name',
          'data-customerror': false,
          'data-customerrortext': ''
        },

        value: '',

        validation: {
          required: true
        },

        valid: false,
        touched: false,
        blurred: false
      },
      description: {
        elementType: 'textarea',
        validateMe: true,

        elementConfig: {
          id: 'productdescription',
          'data-required': true,

          type: 'Description/Product Speifications',
          placeholder: 'Enter Product Description (Not more than 500 words)',
          'data-customerror': true,
          'data-customerrortext': 'Description Must be between 10 and 300 words'
        },

        value: '',

        validation: {
          required: true,
          minLength: 10,
          maxLength: 300
        },

        valid: false,
        touched: false,
        blurred: true
      },

      category: {
        elementType: 'selectWithLabel',
        validateMe: true,

        elementConfig: {
          'data-required': true,

          id: 'sellercategory',
          type: 'Category',
          'data-customerror': false,
          'data-customerrortext': '',
          options: [
            {
              value: '',
              displayValue: '--Select Category--'
            },
            {
              value: 'Beer, Wine & Spirit',
              displayValue: 'Beer, Wine & Spirit'
            },
            {
              value: 'Food Cupboard',
              displayValue: 'Food Cupboard'
            },
            {
              value: 'Beverages',
              displayValue: 'Beverages'
            },
            {
              value: 'Drinks',
              displayValue: 'Drinks'
            },
            {
              value: 'Cooking & Baking',
              displayValue: 'Cooking & Baking'
            },
            {
              value: 'Dried Beans, Grains & Rice',
              displayValue: 'Dried Beans, Grains & Rice'
            },
            {
              value: 'Breakfast Foods',
              displayValue: 'Breakfast Foods'
            },
            {
              value: 'Herbs Spices & Seasoning',
              displayValue: 'Herbs Spices & Seasoning'
            },
            {
              value: 'Candy & Chocolate',
              displayValue: 'Candy & Chocolate'
            },
            {
              value: 'Canned, Jarred & Packaged Foods',
              displayValue: 'Canned, Jarred & Packaged Foods'
            },
            {
              value: 'Jams, Jellies & Sweet Spreads',
              displayValue: 'Jams, Jellies & Sweet Spreads'
            },
            {
              value: 'Condiments & Salad Dressings',
              displayValue: 'Condiments & Salad Dressings'
            }
          ]
        },
        value: '',

        validation: {
          required: true
        },

        valid: false,
        touched: false,
        blurred: false
      },
      productQuantity: {
        validateMe: true,

        elementType: 'input',

        elementConfig: {
          id: 'productQuantity',
          type: 'Product Quantity',
          placeholder: 'Enter Product Quantity',
          'data-required': true
        },

        value: '',

        validation: {
          required: true
        },

        valid: false,
        touched: false,
        blurred: false
      },

      price: {
        validateMe: true,

        elementType: 'input',

        elementConfig: {
          id: 'productprice',
          type: 'Price',
          placeholder: 'Enter Product Price',
          'data-required': true,
          'data-isnum': 'true'
        },

        value: '',

        validation: {
          required: true
        },

        valid: false,
        blurred: false,
        touched: false
      },
      referenceNumber: {
        elementType: 'input',
        validateMe: false,

        elementConfig: {
          id: 'productserialnumber',
          type: 'Product Serial Number',
          placeholder: 'Enter Product Serial Number',
          'data-required': false
        },

        value: '',

        validation: {
          required: false
        },

        valid: true,
        blurred: false,
        touched: false
      }
    },
    preValid: false,

    formValidity: false,
    imagePreviewUrls: {
      fileOne: null,
      fileTwo: null,
      fileThree: null
    },
    files: {
      fileOne: null,
      fileTwo: null,
      fileThree: null
    },
    dragOverStyle: {
      fileOne: null,
      fileTwo: null,
      fileThree: null
    },
    // dragOverCursorStyle: "default",
    isDragOver: {
      fileOne: null,
      fileTwo: null,
      fileThree: null
    },
    searchTagConfig: {
      value: '',
      tags: []
    },
    prevUrl: null,
    zoomImage: false,
    loading: false
    // searchTagConfigValue: ""
  };
  preventDefaultFunc = e => {
    e.preventDefault();
  };
  componentDidMount() {
    this.props.checkAuth();
    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
  }
  componentWillUnmount() {
    onbeforeunload = null;
    window.removeEventListener('dragover', this.preventDefaultFunc);
    window.removeEventListener('drop', this.preventDefaultFunc);
  }
  componentWillMount() {
    // localStorage.setItem('test', JSON.stringify({ ...this.state }));
    onbeforeunload = e => "Don't leave";
    window.addEventListener('dragover', this.preventDefaultFunc, false);
    window.addEventListener('drop', this.preventDefaultFunc, false);
  }

  onChangeHandler = (event, controlName) => {
    // console.log(this.state.formValidity);
    let newControls = { ...this.state.controls };
    let updatedControls = priceQuantCheck(
      event,
      this.state,
      controlName,
      newControls,
      event
    );
    if (updatedControls === undefined) {
      updatedControls = updateObject(this.state.controls, {
        ...this.state.controls,
        [controlName]: updateObject(this.state.controls[controlName], {
          value: event.target.value,
          valid: checkValidity(
            event.target.value,
            this.state.controls[controlName].validation
          ),
          touched: true
        })
      });
    } else if (updatedControls === null) {
      updatedControls = newControls;
    }

    this.setState(pState => {
      return {
        controls: updatedControls
      };
    });

    let isValid = true;
    for (let inputIdentifier in updatedControls) {
      isValid = isValid && updatedControls[inputIdentifier].valid;
    }
    this.setState(prevState => {
      let gval = true;
      if (
        (isValid && prevState.files.fileOne) ||
        (isValid && prevState.files.fileTwo) ||
        (isValid && prevState.files.fileThree)
      ) {
        gval = true;
      } else {
        gval = false;
      }
      if (!isValid) {
        gval = false;
      }

      return {
        controls: updatedControls,
        preValid: isValid,
        formValidity: gval
      };
    });
  };

  handleImageChange = (e, imgControl) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onprogress = data => {
      if (data.lengthComputable) {
      }
    };
    reader.onloadend = () => {
      this.setState(prevState => {
        return {
          files: {
            ...prevState.files,
            [imgControl]: file
          },
          imagePreviewUrls: {
            ...prevState.imagePreviewUrls,
            [imgControl]: reader.result
          },
          formValidity: prevState.preValid && true
        };
      });
    };

    if (file && file.type.match('image.*')) {
      reader.readAsDataURL(file);
    } else {
      return;
    }
  };

  onBlurHandler = (event, inputIdentifier) => {
    let controlsForBlur = {
      ...this.state.controls,
      [inputIdentifier]: {
        ...this.state.controls[inputIdentifier],
        blurred: true
      }
    };
    this.setState({ controls: controlsForBlur });
  };

  onSubmitHandler = event => {
    this.props.checkAuth();

    let token = localStorage.getItem('token');
    if (!token) return this.props.history.push('/');
    this.setState({
      loading: true
    });
    event.preventDefault();
    const {
      productName,
      description,
      category,
      productQuantity,
      price,
      referenceNumber
    } = this.state.controls;
    const { fileOne, fileTwo, fileThree } = this.state.files;
    const { tags } = this.state.searchTagConfig;
    const productInfo = {
      productName: productName.value,
      description: description.value,
      category: category.value,
      productQuantity: productQuantity.value,
      price: price.value,
      referenceNumber: referenceNumber.value,

      tags
    };

    this.props.onProdAdd(this.props.userId, productInfo, [
      fileOne,
      fileTwo,
      fileThree
    ]);
  };
  dragOverHandler = (e, imgControl) => {
    e.preventDefault();
    // console.log(e, "dragOver")
    this.setState(prevState => {
      return {
        dragOverStyle: {
          ...prevState.dragOverStyle,
          [imgControl]: '0.6'
        },
        isDragOver: {
          ...prevState.isDragOver,
          [imgControl]: 'true'
        }
      };
    });
  };

  dragLeaveHandler = (e, imgControl) => {
    e.preventDefault();
    // console.log(e, "dragOver")
    this.setState(prevState => {
      return {
        dragOverStyle: {
          ...prevState.dragOverStyle,
          [imgControl]: '1'
        },
        isDragOver: {
          ...prevState.isDragOver,
          [imgControl]: false
        }
      };
    });
  };

  onDropHandler = (e, imgControl) => {
    e.preventDefault();
    e.stopPropagation();
    const customEvent = {
      preventDefault: () => console.log('prevented'),
      target: {
        files: [e.dataTransfer.files[0]]
      }
    };
    this.handleImageChange(customEvent, imgControl);
    this.setState(prevState => {
      return {
        dragOverStyle: {
          ...prevState.dragOverStyle,
          [imgControl]: '1'
        },
        isDragOver: {
          ...prevState.isDragOver,
          [imgControl]: null
        }
      };
    });

    // console.log(e.dataTransfer.files);
  };

  closedUrlHandler = () => {
    this.setState({
      prevUrl: null
    });
  };
  showPreview = imgControl => {
    this.setState({ prevUrl: this.state.imagePreviewUrls[imgControl] });
  };

  zoomHandler = () => {
    this.setState(prevState => {
      return { zoomImage: !prevState.zoomImage };
    });
  };

  onInputTagChangeHandler = e => {
    this.setState({
      searchTagConfig: { ...this.state.searchTagConfig, value: e.target.value }
    });
    if (
      e.target.value.split('').find(l => l === ',') &&
      e.target.value.length > 1
    ) {
      let tags = this.state.searchTagConfig.tags.concat(
        e.target.value.substring(0, e.target.value.length - 1)
      );
      this.setState({
        searchTagConfig: { ...this.state.searchTagConfig, value: '', tags }
      });
    }
  };

  deleteTagHandler = indextodelete => {
    let prevTags = [...this.state.searchTagConfig.tags];
    // console.log(indextodelete);
    let tags = prevTags.filter((tag, i) => i !== indextodelete);
    this.setState({
      searchTagConfig: {
        ...this.state.searchTagConfigValue,
        tags
      }
    });
  };

  keyPressHandler = e => {
    if (
      (e.keyCode === 9 || e.keyCode === 8) &&
      this.state.searchTagConfig.tags.length > 0 &&
      this.state.searchTagConfig.value.length === 0
    ) {
      let prevTags = [...this.state.searchTagConfig.tags];
      let tags = prevTags.splice(0, prevTags.length - 1);
      this.setState({
        searchTagConfig: {
          ...this.state.searchTagConfig,
          tags
        }
      });
    }
  };

  render() {
    let formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        changed={event => {
          this.onChangeHandler(event, formElement.id);
        }}
        customerror={formElement.customerror}
        customerrortext={formElement.customerrortext}
        invalid={!formElement.config.valid}
        shouldBeValidated={formElement.config.validation}
        touched={formElement.config.touched}
        valueType={formElement.id}
        display={formElement.display}
        blurred={event => this.onBlurHandler(event, formElement.id)}
        isBlurredOut={formElement.config.blurred}
        showFormDynamic={formElement.config.showFormDynamic || false}
      />
    ));
    let { fileOne, fileTwo, fileThree } = this.state.imagePreviewUrls;

    let $imagePreviewOne = null;
    let $imagePreviewTwo = null;
    let $imagePreviewThree = null;
    if (fileOne) {
      $imagePreviewOne = (
        <div className={classes.imgPrevBox}>
          <div className={classes.ChangeImage}>
            <p
              className={classes.ChangeImageText}
              style={{ position: 'absolute' }}
              onClick={() => this.showPreview('fileOne')}
            >
              Preview
            </p>
            <label
              className={classes.ChangeImageTextTwo}
              htmlFor='productfileOne'
            >
              Change{' '}
            </label>
          </div>
          <img alt={`${fileOne}`} src={fileOne} />
        </div>
      );
    }
    if (fileTwo) {
      $imagePreviewTwo = (
        <div className={classes.imgPrevBox}>
          <div className={classes.ChangeImage}>
            <p
              className={classes.ChangeImageText}
              style={{ position: 'absolute' }}
              onClick={() => this.showPreview('fileTwo')}
            >
              Preview
            </p>
            <label
              className={classes.ChangeImageTextTwo}
              htmlFor='productfileTwo'
            >
              Change{' '}
            </label>
          </div>

          <img alt={`${fileTwo}`} src={fileTwo} />
        </div>
      );
    }
    if (fileThree) {
      $imagePreviewThree = (
        <div className={classes.imgPrevBox}>
          <div className={classes.ChangeImage}>
            <p
              className={classes.ChangeImageText}
              style={{ position: 'absolute' }}
              onClick={() => this.showPreview('fileThree')}
            >
              Preview
            </p>
            <label
              className={classes.ChangeImageTextTwo}
              htmlFor='productfileThree'
            >
              Change{' '}
            </label>
          </div>

          <img alt={`${fileThree}`} src={fileThree} />
        </div>
      );
    }

    const imageInputStaticValues = imageParameters(
      $imagePreviewOne,
      $imagePreviewTwo,
      $imagePreviewThree,
      this.state
    );
    let imageInputCard = imageInputStaticValues.map(card => {
      return (
        <div
          className={classes.InputCard}
          key={card.name}
          style={{
            opacity: this.state.dragOverStyle[card.name]
            // cursor: this.state.dragOverCursorStyle
          }}
          onDragLeave={e => {
            this.dragLeaveHandler(e, card.name);
          }}
          onDragOver={e => {
            this.dragOverHandler(e, card.name);
          }}
          onDrop={e => {
            this.onDropHandler(e, card.name);
          }}
        >
          <ImageInput
            onChange={e => this.handleImageChange(e, card.name)}
            name={card.name}
            type='file'
            id={card.id}
            imagepreview={card.imagepreview}
            imagenumber={`Upload product image ${card.imagenumber}`}
            isover={this.state.isDragOver[card.name]}
            inputid={card.inputid}
            icon={faImage}
          />
        </div>
      );
    });
    let redirectSuccess = null;
    if (this.props.success) {
      redirectSuccess = <Redirect to='/sellerpage/products' />;
    }
    const backdropStyle = {
      width: '100%',
      background: 'rgba(255,255,255,.7)',
      position: 'fixed',
      height: '100vh',
      zIndex: 10000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };

    return (
      <React.Fragment>
        {this.props.loadingAddProduct ? (
          <div style={backdropStyle}>
            <div>
              <Spinner />
              <h2 style={{ fontWeight: 100 }}>Sending Product</h2>
            </div>
          </div>
        ) : null}
        <SellerBackendLayout>
          {redirectSuccess}
          <Prompt
            when={this.props.prompt}
            message='You may have unsaved changes, are you sure you want to leave?'
          />
          <div className={classes.prevCont}>
            <ImagePreview
              zoomToggle={this.zoomHandler}
              isZoom={this.state.zoomImage}
              onPrev={this.state.prevUrl}
              closed={this.closedUrlHandler}
            />
          </div>
          <div className={classes.NavCont}></div>
          {/* Heading */}
          <div className={classes.AddProductContainer}>
            <h2>Add a new product</h2>

            {/* Form Container */}
            <div className={classes.FormContainer}>
              {/* form loaded from render */}
              {form}
              {/* Button Container */}
              <div className={classes.inputTags}>
                <InputTags
                  tags={this.state.searchTagConfig.tags}
                  inputTagChangeHandler={this.onInputTagChangeHandler}
                  value={this.state.searchTagConfig.value}
                  deleteTagHandler={this.deleteTagHandler}
                  keyPressHandler={this.keyPressHandler}
                />
              </div>
              <div>
                <h2>Upload Product Images</h2>
              </div>
              <div className={classes.ImageUploadContainer}>
                {imageInputCard}
              </div>
              {/* <div className={classes.SaveAndContinue}>
              <button
                disabled={!this.state.formValidity}
                onClick={this.onSubmitHandler}
              >
                Add Product to Store
              </button>
            </div> */}
              <div className={classes.SaveAndContinue}>
                <button
                  disabled={!this.state.formValidity}
                  onClick={this.onSubmitHandler}
                >
                  ADD PRODUCT TO STORE
                </button>
              </div>
            </div>
          </div>
        </SellerBackendLayout>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  // console.log(state);
  return {
    prodState: state.prod.products,
    prompt: state.prod.prompt,
    success: state.prod.success,
    userId: state.auth._id,
    loadingAddProduct: state.prod.loadingAddProduct
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onProdAdd: (userId, prodInfo, productFiles) =>
      dispatch(addNewProduct(userId, prodInfo, productFiles)),
    checkAuth: () => dispatch(authCheckOnContainer())

    // onPageLoad: () => dispatch(initAddProduct())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddProductContainer);
