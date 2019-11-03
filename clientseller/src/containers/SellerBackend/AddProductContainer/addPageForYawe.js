import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import classes from './AddProductContainer.module.css';
import Input from '../../../components/UI/Input/Input';
import {
  addNewProduct,
  initAddProduct
} from '../../../store/actions/actionIndex';
import { connect } from 'react-redux';
import { Prompt, Link, Redirect } from 'react-router-dom';

import { updateObject, checkValidity } from '../../../shared/utitlity';

import renderSub from './renderSubCategory';
import renderInnerSubCat from './renderInnerSubCat';
import { laptopCatPrinter } from './LaptopCatPrinter';
// import Modal from '../../../components/UI/Modal/Modal';
class AddProductContainer extends Component {
  state = {
    controls: {
      productName: {
        elementType: 'input',

        elementConfig: {
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

        elementConfig: {
          id: 'productdescription',
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

        elementConfig: {
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
              value: 'Agriculture & Food',
              displayValue: 'Agriculture & Food'
            },
            {
              value: 'Apparel Textiles & Accessories',
              displayValue: 'Apparel Textiles & Accessories'
            },
            {
              value: 'Auto & Transportation',
              displayValue: 'Auto & Transportation'
            },
            {
              value: 'Bags, Shoes & Accessories',
              displayValue: 'Bags, Shoes & Accessories'
            },
            {
              value: 'Electronics',
              displayValue: 'Electronics'
            },
            {
              value: 'Electrical Equipment, Components & Telecoms',
              displayValue: 'Electrical Equipment, Components & Telecoms'
            },
            {
              value: 'Gifts Sports & Toys',
              displayValue: 'Gifts Sports & Toys'
            },
            {
              value: 'Health & Beauty',
              displayValue: 'Health & Beauty'
            },
            {
              value: 'Home, Lights & Construction',
              displayValue: 'Home, Lights & Construction'
            },
            {
              value: 'Machinery, Industrial Parts & Tools',
              displayValue: 'Machinery, Industrial Parts & Tools'
            },
            {
              value: 'Metallurgy, Chemicals, Rubber & Plastics',
              displayValue: 'Metallurgy, Chemicals, Rubber & Plastics'
            },
            {
              value: 'Packaging & Advertising Services',
              displayValue: 'Packaging & Advertising Services'
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
      subCategory: {
        elementType: 'selectWithLabel',

        elementConfig: {
          id: 'sellersubcategory',
          type: 'Sub Category',
          'data-customerror': false,
          'data-customerrorText': '',

          options: [{ value: '', displayValue: '' }]
        },
        value: '',

        validation: {
          required: true
        },

        valid: false,
        touched: false,
        blurred: false
      },
      subInnerCat: {
        elementType: 'selectWithLabel',

        elementConfig: {
          'data-customerror': false,
          'data-customerrotext': '',
          id: 'subInnerCat',
          type: 'Item type',
          conditionalRender: '',
          // conditionalRender: "isLaptop",

          options: [{ value: '', displayValue: '' }]
        },
        value: '',

        validation: {
          required: true
        },

        valid: false,
        touched: false,
        blurred: false
      }
    },

    formValidity: false
  };
  preventDefaultFunc = e => {
    e.preventDefault();
  };
  componentWillMount() {
    onbeforeunload = e => "Don't leave";
    window.addEventListener('dragover', this.preventDefaultFunc, false);
    window.addEventListener('drop', this.preventDefaultFunc, false);
  }
  componentDidMount() {
    this.props.onPageLoad();
    console.log(this.props);
  }

  onChangeHandler = (event, controlName) => {
    let updatedControls = updateObject(this.state.controls, {
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

    let subInnerConditionalRender = '';
    // conditionally render input. We are starting with laptops first then later to phones and then shoes
    if (
      updatedControls.subInnerCat.value ===
        'Laptops, Computer Hardware & Software' &&
      controlName === 'subInnerCat'
    ) {
      updatedControls = updateObject(this.state.controls, {
        ...this.state.controls,
        subInnerCat: updateObject(this.state.controls[controlName], {
          value: event.target.value,
          valid: checkValidity(
            event.target.value,
            this.state.controls[controlName].validation
          ),
          touched: true
        }),
        screenSize: {
          elementType: 'selectWithLabel',
          elementConfig: {
            'data-customerror': false,
            'data-customerrotext': '',
            id: 'screensizeseller',
            type: 'Screen Size',

            options: laptopCatPrinter('size')
          },
          value: '',

          validation: {
            required: true
          },

          valid: false,
          touched: false,
          blurred: false,
          showFormDynamic: true
        },
        ramSize: {
          elementType: 'selectWithLabel',
          elementConfig: {
            'data-customerror': false,
            'data-customerrotext': '',
            id: 'ramsizeseller',
            type: 'Ram Size',

            options: laptopCatPrinter('ram')
          },
          value: '',

          validation: {
            required: true
          },

          valid: false,
          touched: false,
          blurred: false,
          showFormDynamic: true
        },
        batteryCapacity: {
          elementType: 'selectWithLabel',
          elementConfig: {
            'data-customerror': false,
            'data-customerrotext': '',
            id: 'batteryCapacityseller',
            type: 'Battery Capacity',

            options: laptopCatPrinter('Battery Capacity')
          },
          value: '',

          validation: {
            required: true
          },

          valid: false,
          touched: false,
          blurred: false,
          showFormDynamic: true
        },
        hardDrive: {
          elementType: 'selectWithLabel',
          elementConfig: {
            'data-customerror': false,
            'data-customerrotext': '',
            id: 'hardDriveseller',
            type: 'Hard Drive Size',

            options: laptopCatPrinter('hardDrive')
          },
          value: '',

          validation: {
            required: true
          },

          valid: false,
          touched: false,
          blurred: false,
          showFormDynamic: true
        },
        operatingSystem: {
          elementType: 'selectWithLabel',
          elementConfig: {
            'data-customerror': false,
            'data-customerrotext': '',
            id: 'operatingSystemseller',
            type: 'Operating System',

            options: laptopCatPrinter('os')
          },
          value: '',

          validation: {
            required: true
          },

          valid: false,
          touched: false,
          blurred: false,
          showFormDynamic: true
        },
        laptopBrand: {
          elementType: 'selectWithLabel',
          elementConfig: {
            'data-customerror': false,
            'data-customerrotext': '',
            id: 'laptopBrandseller',
            type: 'Laptop Brand',

            options: laptopCatPrinter('brand')
          },
          value: '',

          validation: {
            required: true
          },

          valid: false,
          touched: false,
          blurred: false,
          showFormDynamic: true
        }
      });
      console.log(updatedControls, 'error');
    } else if (
      updatedControls.subInnerCat.value !==
      'Laptops, Computer Hardware & Software'
    ) {
      delete updatedControls.screenSize;
      delete updatedControls.ramSize;
      delete updatedControls.batteryCapacity;
      delete updatedControls.hardDrive;
      delete updatedControls.operatingSystem;
      delete updatedControls.laptopBrand;
    }
    if (controlName === 'category') {
      updatedControls = {
        ...updatedControls,
        subInnerCat: {
          ...updatedControls.subInnerCat,
          elementConfig: {
            ...updatedControls['subInnerCat'].elementConfig,
            options: [{ value: '', displayValue: '' }],
            conditionalRender: subInnerConditionalRender
          },
          valid: false
        },
        subCategory: {
          ...updatedControls.subCategory,
          elementConfig: {
            ...updatedControls['subCategory'].elementConfig,
            options: renderSub(updatedControls['category'].value)
          },
          valid: false
        }
      };
    }
    this.setState(pState => {
      return {
        controls: updatedControls
      };
    });

    if (controlName === 'subCategory') {
      // console.log(renderInnerSubCat(updatedControls["subCategory"].value));
      updatedControls = {
        ...updatedControls,
        subInnerCat: {
          ...updatedControls.subInnerCat,
          elementConfig: {
            ...updatedControls['subInnerCat'].elementConfig,
            options: renderInnerSubCat(updatedControls['subCategory'].value),
            conditionalRender: subInnerConditionalRender
          },
          valid: false
        }
      };
    }

    if (controlName === 'subInnerCat') {
      updatedControls = {
        ...updatedControls,
        subInnerCat: {
          ...updatedControls.subInnerCat,
          elementConfig: {
            ...updatedControls['subInnerCat'].elementConfig,
            conditionalRender: subInnerConditionalRender
          }
        }
      };
    }
    let isValid = true;
    for (let inputIdentifier in updatedControls) {
      isValid = isValid && updatedControls[inputIdentifier].valid;
    }
    this.setState(prevState => {
      return {
        controls: updatedControls,
        preValid: isValid,
        formValidity: isValid
      };
    });
  };

  laptopModalShow = () => {};

  laptopModalRemove = () => {};
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
    event.preventDefault();
    const {
      productName,
      description,
      category,
      subCategory,
      subInnerCat
    } = this.state.controls;
    const productInfo = {
      id: Math.random(),
      productName: productName.value,
      description: description.value,
      category: category.value,
      subCategory: subCategory.value,
      subInnerCat: subInnerCat.value
    };
    console.log(productName.value, description.value, category.value);
    console.log(productInfo);
    this.props.onProdAdd(productInfo);
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
        shouldBeValidated={true}
        touched={formElement.config.touched}
        valueType={formElement.id}
        display={formElement.display}
        blurred={event => this.onBlurHandler(event, formElement.id)}
        isBlurredOut={formElement.config.blurred}
        showFormDynamic={formElement.config.showFormDynamic || false}
      />
    ));
    let redirectSuccess = null;
    if (this.props.success) {
      console.log('suc');
      redirectSuccess = (
        <Redirect to='/sellerpage/products/addnewproduct/pricing' />
      );
    }

    return (
      <SellerBackendLayout>
        {redirectSuccess}
        <Prompt
          when={this.props.prompt}
          message='You may have unsaved changes, are you sure you want to leave?'
        />
        <div className={classes.NavCont}>
          <Link to='/sellerpage/products/addnewproduct'>
            Basic Product Info ->
          </Link>
        </div>
        {/* Heading */}
        <div className={classes.AddProductContainer}>
          <h2>Add a new product</h2>

          {/* Form Container */}
          <div className={classes.FormContainer}>
            {/* form loaded from render */}
            {form}
            {/* Button Container */}
            <div className={classes.SaveAndContinue}>
              <button
                disabled={!this.state.formValidity}
                onClick={this.onSubmitHandler}
              >
                SAVE & CONTINUE
              </button>
            </div>
          </div>
        </div>
      </SellerBackendLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    prodState: state.prod.products,
    prompt: state.prod.prompt,
    success: state.prod.success
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onProdAdd: prodInfo => dispatch(addNewProduct(prodInfo)),
    onPageLoad: () => dispatch(initAddProduct())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddProductContainer);
