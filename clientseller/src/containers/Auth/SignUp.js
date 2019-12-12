import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './SignUp.module.css';
// import { Route } from "react-router-dom";
import ImageContainer from '../../shared/images/geet2.jpg';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utitlity';
import SellerSignUpLayout from '../../components/UI/SellerSignUpLayout/SellerSignUpLayout';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authCheckState, auth } from '../../store/actions/auth';
// import BusinessSellerSignUp from "./BusinessSellerSignUp/BusinessSellerSignUp";

class SignUp extends Component {
  state = {
    controls: {
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

      password: {
        elementType: 'input',

        elementConfig: {
          id: 'password',
          type: 'password',
          placeholder: 'Your Password'
        },

        value: '',

        validation: {
          // required: true,
          // minLength: 8
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
    this.props.onAuthCheckState();
  }

  onChangeHandler = (event, controlName) => {
    // console.log(event.target);
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

    let isValid = true;
    for (let inputIdentifier in updatedControls) {
      isValid = isValid && updatedControls[inputIdentifier].valid;
    }
    this.setState({ controls: updatedControls, formValidity: isValid });
  };

  onSubmitForm = () => {
    // const { email, password } = this.state.controls;
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value
      // this.state.isSignUp
    );
    // console.log(email, password);
    // console.log('props', this.props);
    // this.props.history.push('/');
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
  EnterHandler = e => {
    if (
      e.key === 'Enter'
      // this.state.controls.email.value !== '' &&
      // this.state.controls.password.value !== ''
    ) {
      console.log(e.key);
      this.onSubmitForm();
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
        EnterHandler={this.EnterHandler}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        changed={event => {
          this.onChangeHandler(event, formElement.id);
        }}
        invalid={!formElement.config.valid}
        shouldBeValidated={formElement.config.shouldBeValidated}
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
          <div className={classes.InputContainer}>
            {this.props.error &&
              this.props.error.map(error => {
                return (
                  <p className={classes.AuthError} key={error.msg}>
                    {error.msg}
                  </p>
                );
              })}
            <h2 className={classes.HeaderDescription}>Seller Sign in</h2>
            {form}{' '}
            <div className={classes.ButtonCont}>
              <Button
                disabled={this.props.loading}
                btnType='Go'
                clicked={this.onSubmitForm}
              >
                Sign in
              </Button>
            </div>
          </div>
          <img
            className={[classes.ImageContainer, classes.Appear].join(' ')}
            src={ImageContainer}
            alt={ImageContainer}
          />
        </div>
      </div>
    ) : null;

    return (
      <SellerSignUpLayout subHeader=''>
        {/* {this.props.isAuthenticated ? <Redirect to='/' /> : null} */}
        <div className={classes.AuthTypesContainer}>
          <div className={[classes.Appear].join(' ')}>
            {IndividualSellerForm}
          </div>
        </div>
      </SellerSignUpLayout>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null
    // buildingBurger: state.burgerBuilder.building,
    // authRedirectPath: state.auth.authRedirectPath
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password) => dispatch(auth(email, password)),
    onAuthCheckState: () => dispatch(authCheckState())
    //  onSetAuthRedirectPath: () => dispatch(Actions.setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
