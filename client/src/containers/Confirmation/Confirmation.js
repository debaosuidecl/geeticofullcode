import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import App from '../../App';
import { withRouter } from 'react-router';
import { authSuccess } from '../../store/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import classes from './Confirmation.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import Layout from '../../components/UI/Layout/Layout';

class Confirmation extends Component {
  state = {
    success: false
  };
  componentDidMount() {
    if (this.props.match.params.token) {
      axios
        .get(
          `${App.domain}api/users/confirmation/${this.props.match.params.token}`
        )
        .then(res => {
          localStorage.setItem('token', res.data.token);
          console.log(this.props);
          this.props.onSuccessfulAuthentication(
            res.data.token,
            res.data._id,
            res.data.fullName,
            res.data.email,
            res.data.avatar,
            false
          );
          this.setState({
            success: true
          });
        })
        .catch(error => {
          // console.log(error.response)
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
          this.setState({ success: 0 });
        });
    }
  }
  render() {
    this.props.authSuccessReload
      ? document.querySelector('#authSuccess').click()
      : document.querySelector('#authSuccess').blur();
    return (
      <Layout>
        <div className={classes.Confirmation}>
          {this.state.success === 0 ? (
            <p>An Error Occured</p>
          ) : this.state.success === true ? (
            <div className={classes.Success}>
              <div className={classes.IconForSuccess}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <h2>You have successfully verified your email</h2>
              <p>
                Click <a href='/'>here</a> to continue shopping
              </p>
            </div>
          ) : this.state.success === false ? (
            <Spinner />
          ) : null}
        </div>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSuccessfulAuthentication: (
      token,
      _id,
      fullName,
      email,
      avatar,
      authSuccessReload
    ) =>
      dispatch(
        authSuccess(token, _id, fullName, email, avatar, authSuccessReload)
      )
  };
};
const mapStateToProps = state => {
  return {
    authSuccessReload: state.auth.authSuccessReload
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Confirmation));
