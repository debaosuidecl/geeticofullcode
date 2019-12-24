import * as actionTypes from './actionTypes';
import axios from 'axios';
import App from '../../App';
export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};
export const authCheckStart = () => {
  return {
    type: actionTypes.AUTH_CHECK_START
  };
};

export const authSuccess = (token, _id, fullName, email, avatar) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    _id,
    fullName,
    email,
    avatar
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const authError = errorArray => {
  return {
    type: actionTypes.AUTH_ERROR,
    errorArray
  };
};

export const authLogOut = () => {
  localStorage.removeItem('token');

  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const authExpires = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(authLogOut());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password) => {
  return dispatch => {
    dispatch(authStart());

    const authData = {
      email: email,
      password: password
    };
    let url = `${App.domain}api/auth`;
    axios
      .post(url, authData)
      .then(response => {
        const { token, errors, _id, fullName, email, avatar } = response.data;
        if (errors) {
          dispatch(authFail(response.data.errors));
        }
        if (token) {
          localStorage.setItem('token', token);
          dispatch(authSuccess(token, _id, fullName, email, avatar));
        }
      })

      .catch(error => {
        if (error.response === undefined)
          return dispatch(authFail([{ msg: 'server Error' }]));
        console.log(error.response.data);
        if (error.response.data.errors) {
          dispatch(authFail(error.response.data.errors));
        }
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckOnContainer = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(authLogOut());
      dispatch(authFail(''));
    } else {
      let config = {
        headers: {
          'x-auth-token': token
        }
      };
      let url = `${App.domain}api/auth`;
      axios
        .get(url, config)
        .then(response => {
          const { email, _id, fullName, avatar } = response.data;

          setTimeout(() => {
            dispatch(authSuccess(token, _id, fullName, email, avatar));
          }, 500);
        })

        .catch(error => {
          if (error.response.data.msg) {
            dispatch(authLogOut());

            dispatch(authFail(''));
          }
        });
    }
  };
};

export const authCheckState = () => {
  return dispatch => {
    dispatch(authCheckStart());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(authLogOut());
      dispatch(authFail(''));
    } else {
      let config = {
        headers: {
          'x-auth-token': token
        }
      };
      let url = `${App.domain}api/auth`;
      axios
        .get(url, config)
        .then(response => {
          console.log('success');
          console.log(response, ' from new');
          const { email, _id, fullName, avatar } = response.data;
          setTimeout(() => {
            dispatch(authSuccess(token, _id, fullName, email, avatar));
          }, 500);
        })

        .catch(error => {
          if (error.response && error.response.data.msg) {
            dispatch(authLogOut());
            console.log('fail');

            dispatch(authFail(''));
          }
        });
    }
  };
};
