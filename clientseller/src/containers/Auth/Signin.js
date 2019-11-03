import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './SignUp.module.css';
// import { Route } from "react-router-dom";
import ImageContainer from '../../shared/images/individualseller.jpg';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utitlity';
import SellerSignUpLayout from '../../components/UI/SellerSignUpLayout/SellerSignUpLayout';
// import BusinessSellerSignUp from "./BusinessSellerSignUp/BusinessSellerSignUp";

class SignUp extends Component {
  state = {
    controls: {
      firstName: {
        elementType: 'input',

        elementConfig: {
          id: 'firstName',
          type: 'First Name',
          placeholder: 'Enter your first name'
        },

        value: '',

        validation: {
          required: true
        },

        valid: false,
        touched: false,
        blurred: false
      },
      lastName: {
        elementType: 'input',

        elementConfig: {
          id: 'lastName',
          type: 'Last Name',
          placeholder: 'Enter your last name'
        },

        value: '',

        validation: {
          required: true
        },

        valid: false,
        touched: false,
        blurred: false
      },
      email: {
        elementType: 'input',

        elementConfig: {
          id: 'email',
          type: 'email',
          placeholder: 'Your Email'
        },

        value: '',

        validation: {
          required: true,
          isEmail: true
        },

        valid: false,
        blurred: false,
        touched: false
      },
      // preferredStoreName: {
      //   elementType: "input",

      //   elementConfig: {
      //     id: "preferredStoreName",
      //     type: "Preferred Store Name",
      //     placeholder: "Enter your preferred store name"
      //   },

      //   value: "",

      //   validation: {
      //     required: true
      //   },

      //   valid: false,
      //   touched: false,
      //   blurred: false
      // },
      // phoneNumber: {
      //   elementType: "input",

      //   elementConfig: {
      //     id: "phonenumber",
      //     type: "Phone Number",
      //     placeholder: "Phone Number..."
      //   },

      //   value: "",

      //   validation: {
      //     required: true
      //   },

      //   valid: false,
      //   touched: false,
      //   blurred: false
      // },

      password: {
        elementType: 'input',

        elementConfig: {
          id: 'password',
          type: 'password',
          placeholder: 'Your Password'
        },

        value: '',

        validation: {
          required: true,
          minLength: 8
        },

        valid: false,
        blurred: false,
        touched: false
      }
    },

    formValidity: true,
    individualSellerSelected: true,
    businessSellerSelected: false
  };
  componentDidMount() {
    //  if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
    //     this.props.onSetAuthRedirectPath()
    //     }
  }

  onChangeHandler = (event, controlName) => {
    console.log(event.target);
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
    if (
      controlName === 'phoneNumber' &&
      event.target.id === 'phonenumberInputModule'
    ) {
      updatedControls = updateObject(this.state.controls, {
        ...this.state.controls,
        [controlName]: updateObject(this.state.controls[controlName], {
          dropDownValue: event.target.value,

          touched: true
        })
      });
    }
    let isValid = true;
    for (let inputIdentifier in updatedControls) {
      isValid = isValid && updatedControls[inputIdentifier].valid;
    }
    this.setState({ controls: updatedControls, formValidity: isValid });
  };

  onSubmitForm = () => {
    const { email, password, firstName, lastName } = this.state.controls;
    // this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
    console.log(email, password, firstName, lastName);
    console.log('props', this.props);
    this.props.history.push('/');
  };
  toBusinessSeller = () => {
    this.setState({
      businessSellerSelected: true,
      individualSellerSelected: false
    });
    this.props.history.push(`${this.props.match.path}/businessseller`);
  };

  onBlurHandler = (event, inputIdentifier) => {
    let controlsForBlur = {
      ...this.state.controls,
      [inputIdentifier]: {
        ...this.state.controls[inputIdentifier],
        blurred: this.state.controls[inputIdentifier].value !== null
      }
    };
    this.setState({ controls: controlsForBlur });
  };

  onIndividualSellerSelected = () => {
    this.setState({
      businessSellerSelected: false,
      individualSellerSelected: true
    });
  };
  onBusinessSellerSelected = () => {
    this.setState({
      businessSellerSelected: true,
      individualSellerSelected: false
    });
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
        invalid={!formElement.config.valid}
        shouldBeValidated={true}
        touched={formElement.config.touched}
        valueType={formElement.id}
        blurred={event => this.onBlurHandler(event, formElement.id)}
        isBlurredOut={formElement.config.blurred}
      />
    ));
    if (this.props.loading) {
      form = <Spinner />;
    }
    const IndividualSellerForm = this.state.individualSellerSelected ? (
      <div className={classes.Container}>
        <div className={classes.Auth}>
          <div className={classes.InputContainer}>{form}</div>
          <img
            className={[classes.ImageContainer, classes.Appear].join(' ')}
            src={ImageContainer}
            alt={ImageContainer}
          />
        </div>
      </div>
    ) : null;

    return (
      <SellerSignUpLayout subHeader='Seller Registration'>
        <div className={classes.AuthTypesContainer}>
          <div className={[classes.Appear].join(' ')}>
            {IndividualSellerForm}

            <div className={classes.ButtonCont}>
              <Button
                // disabled={!this.state.formValidity}
                btnType='Success'
                clicked={this.onSubmitForm}
              >
                Register as Individual Seller
              </Button>
            </div>
          </div>
        </div>
      </SellerSignUpLayout>
    );
  }
}

export default SignUp;
