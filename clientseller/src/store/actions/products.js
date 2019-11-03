import {
  ADD_NEW_PRODUCT,
  INIT_ADD_PRODUCT,
  APPEND_TO_PRODUCT,
  PRODUCT_FETCH_START,
  PRODUCT_FETCH_SUCCESS,
  PRODUCT_ADD_FAIL
} from './actionTypes';
import axios from 'axios';
import { authLogOut } from './auth';
import App from '../../App';
export const productAdd = (userId, productInfo) => {
  // console.log(userId, productInfo, 'from addNewProduct');
  // axios.post
  return {
    type: ADD_NEW_PRODUCT,
    productInfo
  };
};
export const productFetchStart = () => {
  return {
    type: PRODUCT_FETCH_START
  };
};
export const productAddFail = () => {
  return {
    type: PRODUCT_ADD_FAIL
  };
};
export const productFetchSuccess = productArray => {
  return {
    type: PRODUCT_FETCH_SUCCESS,
    productArray
  };
};

export const fetchUserProducts = () => {
  return dispatch => {
    dispatch(productFetchStart());
    let token = localStorage.getItem('token');
    if (!token) return dispatch(authLogOut());
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    axios
      .get(
        `${App.domain}api/upload
    `,
        config
      )
      .then(response => {
        dispatch(productFetchSuccess(response.data));
      })
      .catch(error => {});
  };
};

export const addNewProduct = (userId, productInfo, productFiles) => {
  return dispatch => {
    // console.log(userId, productInfo, 'from addNewProduct');
    dispatch(initAddProduct());
    let formData = new FormData();
    formData.append('productInfo', JSON.stringify(productInfo));
    productFiles.forEach(file => {
      if (file === null) {
        console.log('is null');
      } else {
        formData.append('myImages', file);
      }
    });
    let token = localStorage.getItem('token');
    if (!token) return dispatch(authLogOut());
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'x-auth-token': token
      }
    };
    axios
      .post(`${App.domain}api/upload`, formData, config)
      .then(response => {
        console.log(response);
        // alert('The file is successfully uploaded');
        dispatch(productAdd(userId, productInfo));
      })
      .catch(error => {
        console.log(error);
        dispatch(productAddFail());
        alert('Critical Failure in Adding Product');
      });
    // console.log(formData);
  };
};

export const appendToProduct = (id, stepTwoDetails) => {
  // console.log(productInfo);
  return {
    type: APPEND_TO_PRODUCT,
    id,
    stepTwoDetails
  };
};
export const initAddProduct = () => {
  return {
    type: INIT_ADD_PRODUCT
  };
};
