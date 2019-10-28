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
    // userId: userId
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
export const toggleAuthModalAction = () => {
  return {
    type: actionTypes.SHOW_AUTH_MODAL
  };
};
export const setAuthModalToTrue = () => {
  return {
    type: actionTypes.SET_AUTH_MODAL_TO_TRUE
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

export const auth = (email, password, fullName, isSignin) => {
  return dispatch => {
    dispatch(authStart());

    let authData;
    let url;
    if (isSignin) {
      authData = {
        email: email,
        password: password
      };
      url = `${App.domain}api/userauth/`;
    } else {
      authData = {
        email,
        fullName,
        password
      };
      url = `${App.domain}api/users/`;
    }

    // let url = 'http://localhost:5000/api/auth';
    axios
      .post(url, authData)
      .then(response => {
        // console.log(response);
        // console.log(response.data, 'authAc');
        const { token, errors, _id, fullName, email, avatar } = response.data;
        if (errors) {
          // throw new Error()
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
        // console.log(error.response.data);
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

export const authCheckBeforeOp = () => {
  return dispatch => {
    // dispatch(authCheckBeforeOpStart());
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
      let url = `${App.domain}api/userauth/`;
      axios
        .get(url, config)
        .then(response => {
          // console.log(response.data);
          if (response.data === null) {
            dispatch(authLogOut());
            dispatch(authFail(''));
            return;
          }
          const { email, _id, fullName, avatar } = response.data;
          setTimeout(() => {
            dispatch(authSuccess(token, _id, fullName, email, avatar));
          }, 500);
        })

        .catch(error => {
          // console.log(error.response.data);
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
      let url = `${App.domain}api/userauth/`;
      axios
        .get(url, config)
        .then(response => {
          const { email, _id, fullName, avatar } = response.data;
          // console.log(response.data);
          dispatch(authSuccess(token, _id, fullName, email, avatar));
        })

        .catch(error => {
          if (error.response && error.response.data.msg) {
            dispatch(authLogOut());

            dispatch(authFail(''));
          }
        });
    }
  };
};
