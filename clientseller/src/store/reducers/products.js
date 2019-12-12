import {
  ADD_NEW_PRODUCT,
  INIT_ADD_PRODUCT,
  PRODUCT_FETCH_SUCCESS,
  PRODUCT_FETCH_START,
  PRODUCT_ADD_FAIL,
  SET_SUCCESS_NULL
} from '../actions/actionTypes';

let initialState = {
  products: [],
  prompt: true,
  success: false,
  showSuccessTag: false,
  loadingProduct: false,
  failure: false,
  loadingAddProduct: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_FETCH_SUCCESS:
      return {
        ...state,
        prompt: false,
        success: false,
        products: action.productArray,
        loadingProduct: false,
        loadingAddProduct: false,
        failure: false
        // showSuccessTag:
      };
    case PRODUCT_ADD_FAIL:
      return {
        ...state,
        prompt: false,
        success: false,
        // products: action.productArray,
        loadingAddProduct: false,
        failure: false
      };
    case PRODUCT_FETCH_START:
      return {
        ...state,
        prompt: false,
        success: false,
        failure: false,
        loadingProduct: true,
        loadingAddProduct: false
        // products: action.productArray
      };
    case INIT_ADD_PRODUCT:
      return {
        ...state,
        failure: false,
        prompt: true,
        success: false,
        showSuccessTag: false,
        loadingAddProduct: true
      };
    case ADD_NEW_PRODUCT:
      // let newProductArray = [...state.products, action.productInfo];
      return {
        ...state,
        // products: newProductArray,
        prompt: false,
        success: true,

        showSuccessTag: true,
        failure: false,
        loadingAddProduct: false
      };
    case SET_SUCCESS_NULL:
      return {
        ...state,
        prompt: false,
        success: false,
        failure: false,
        loadingAddProduct: false
      };
    default: {
      return state;
    }
  }
};

export default reducer;
