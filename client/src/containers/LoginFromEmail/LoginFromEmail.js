import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { authSuccess } from '../../store/actions/auth';
import queryString from 'query-string';

export class LoginFromEmail extends Component {
  componentDidMount() {
    if (this.props.match.params.token) {
      axios
        .get(
          `${App.domain}api/users/confirmation-from-email/${this.props.match.params.token}`
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
    return <div></div>;
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
)(withRouter(LoginFromEmail));
