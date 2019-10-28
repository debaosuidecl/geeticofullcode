import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utitlity';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authCheckLoading: false,
  authRedirectPath: null,
  _id: null,
  firstLoad: 0,
  fullName: null,
  email: null,
  avatar: null,
  authCheckBeforeOpLoading: false,

  showAuthModal: false
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    token: null,
    _id: null,
    fullName: null,
    email: null,
    authCheckBeforeOpLoading: false,
    avatar: null
  });
};
const authCheckStart = (state, action) => {
  return updateObject(state, {
    error: null,
    authCheckLoading: true,
    authCheckBeforeOpLoading: false,
    firstLoad: 1
  });
};
const authCheckBeforeOpStart = (state, action) => {
  return updateObject(state, {
    error: null,
    authCheckBeforeOpLoading: true,
    firstLoad: 1
  });
};
const authSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    authCheckLoading: false,
    error: null,
    firstLoad: 1,
    token: action.idToken,
    _id: action._id,
    fullName: action.fullName,
    email: action.email,
    avatar: action.avatar,
    authCheckBeforeOpLoading: false
  });
};
const authFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    authCheckLoading: false,
    authCheckBeforeOpLoading: false,
    firstLoad: 1,
    error: action.error
  });
};

const authLogOut = (state, action) => {
  // location.reload();
  return updateObject(state, {
    error: null,
    firstLoad: 1,

    authCheckBeforeOpLoading: false,

    token: null,
    _id: null,
    fullName: null,
    email: null,
    avatar: null
  });
};
const toggleAuthModal = (state, action) => {
  // location.reload();
  return updateObject(state, {
    showAuthModal: !state.showAuthModal,
    authCheckBeforeOpLoading: false,
    firstLoad: 1
  });
};
const setAuthModalToTrue = (state, action) => {
  // location.reload();
  return updateObject(state, {
    showAuthModal: true,
    authCheckBeforeOpLoading: false,
    firstLoad: 1
  });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, {
    authRedirectPath: action.path,
    firstLoad: 1
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_CHECK_BEFORE_AUTH:
      return authCheckBeforeOpStart(state, action);
    case actionTypes.AUTH_CHECK_START:
      return authCheckStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogOut(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    case actionTypes.SHOW_AUTH_MODAL:
      return toggleAuthModal(state, action);
    case actionTypes.SET_AUTH_MODAL_TO_TRUE:
      return setAuthModalToTrue(state, action);
    default:
      return state;
  }
};

export default reducer;
