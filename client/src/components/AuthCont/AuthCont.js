import React, { Component } from 'react';
// import SimpleReactValidator from 'simple-react-validator';
// import queryString from 'query-string';
import { Link, withRouter, Redirect } from 'react-router-dom';
import classes from './AuthCont.module.css';
import Button from '../UI/Button/Button';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserAlt,
  faEnvelope,
  faLock,
  faPhone,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import SpinnerTwo from '../UI/Spinner2/Spinner2';
import { auth } from '../../store/actions/auth';

export class AuthCont extends Component {
  state = {
    fullName: '',
    email: '',
    password: '',
    isSignIn: false,
    loading: false,
    phoneNumber: ''
  };

  onEditChange = e => {
    // this.validator.message('fullName', e.target.value, 'required|min:3|max:30');
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  authSwitch = () => {
    this.setState(p => {
      return {
        isSignIn: !p.isSignIn
      };
    });
  };
  onSubmit = () => {
    this.props.onAuth(
      this.state.email,
      this.state.password,
      this.state.fullName,
      this.state.isSignIn,
      this.state.phoneNumber
    );
  };
  render() {
    this.props.tellUserToVerify || this.props.redirectToEmailVerificationPage
      ? document.querySelector('#vemail').click()
      : document.querySelector('#vemail').blur();
    const { fullName, email, password, phoneNumber } = this.state;

    // const { validator } = this;
    return (
      <form
        className={classes.AuthInput}
        onSubmit={e => {
          e.preventDefault();
          this.onSubmit();
        }}
      >
        <div className={classes.Header}>
          <h4>
            {this.state.isSignIn ? 'Sign in' : 'Sign up'} and start shopping
          </h4>
          <FontAwesomeIcon icon={faTimes} onClick={this.props.clicked} />
        </div>
        {this.props.error &&
          this.props.error.map((e, i) => {
            return (
              <div key={i} className={classes.Error}>
                <p>{e.msg}</p>
              </div>
            );
          })}
        {!this.state.isSignIn ? (
          <div className={classes.InputCont}>
            <FontAwesomeIcon icon={faUserAlt} size='1x' />
            <input
              type='text'
              value={fullName}
              placeholder='Full Name'
              className={classes.Input}
              onChange={e => {
                this.onEditChange(e);
              }}
              name='fullName'
            />
          </div>
        ) : null}
        <div className={classes.InputCont}>
          <FontAwesomeIcon icon={faEnvelope} size='1x' />
          <input
            type='email'
            value={email}
            required
            placeholder='Email'
            className={classes.Input}
            onChange={e => {
              this.onEditChange(e);
            }}
            name='email'
          />
        </div>
        <div className={classes.InputCont}>
          <FontAwesomeIcon icon={faLock} size='1x' />
          <input
            type='password'
            value={password}
            required
            placeholder='Password'
            className={classes.Input}
            onChange={e => {
              this.onEditChange(e);
            }}
            name='password'
          />
        </div>
        {!this.state.isSignIn ? (
          <div className={classes.InputCont}>
            <FontAwesomeIcon icon={faPhone} size='1x' />
            <input
              type='text'
              value={phoneNumber}
              required
              placeholder='Phone Number (080..)'
              className={classes.Input}
              onChange={e => {
                this.onEditChange(e);
              }}
              name='phoneNumber'
            />
          </div>
        ) : null}
        <div className={classes.BtnCont}>
          <Button
            btnType='Geetico'
            disabled={this.props.loading}
            clicked={this.onSubmit}
          >
            {!this.state.isSignIn ? 'Sign up' : 'Sign in'}
            {this.props.loading ? <SpinnerTwo /> : null}
          </Button>
        </div>
        {this.state.isSignIn ? null : (
          <div className={classes.Terms}>
            <p>
              By signing up, you agree to our <a href='/terms'>Terms of Use</a>{' '}
              and <a href='/privacy-policy'>Privacy Policy.</a>
            </p>
          </div>
        )}

        <div className={classes.SignIn}>
          <p>
            {this.state.isSignIn
              ? 'No account yet? '
              : 'Already have an account? '}
            <span onClick={this.authSwitch}>
              {' '}
              {!this.state.isSignIn ? 'Sign in' : 'Sign up'}
            </span>
          </p>
        </div>
      </form>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, fullName, isSignIn, phoneNumber) =>
      dispatch(auth(email, password, fullName, isSignIn, phoneNumber))
  };
};
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    loading: state.auth.loading,
    error: state.auth.error,
    tellUserToVerify: state.auth.tellUserToVerify,
    redirectToEmailVerificationPage: state.auth.redirectToEmailVerificationPage
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AuthCont)
);
