import {
  ADD_TO_CART,
  // FETCH_ALL_CART_START,
  // EMPTY_CART,
  START_CART_EDIT,
  SET_CART_VALUE,
  EDIT_CART_QUANTITY,
  DELETE_FROM_CART,
  SHOW_CART_PREVIEW,
  APPEND_PRODUCT_DETAILS_TO_CART_PREVIEW
} from './actionTypes';
import App from '../../App';
import axios from 'axios';

export const showCartPreview = prodObj => {
  return {
    type: SHOW_CART_PREVIEW,
    prodObj
  };
};

export const appendProductDetailsToCartPreview = () => {
  return {
    type: APPEND_PRODUCT_DETAILS_TO_CART_PREVIEW
  };
};

const addToCart = (cartData, fullProduct) => {
  return {
    type: ADD_TO_CART,
    cartData,
    fullProduct
  };
};
export const fetchCart = () => {
  return dispatch => {
    let cart = localStorage.getItem('cart-sama');
    if (!cart) {
      return dispatch(addToCart({}));
    }
    dispatch(addToCart(JSON.parse(cart)));
  };
};
export const initiateEmptyCart = () => {
  return dispatch => {
    let cart = localStorage.getItem('cart-sama');
    dispatch(addToCart({}));
    if (!cart) {
      return dispatch(setCartValue([]));
    }
    localStorage.removeItem('cart-sama');
    return dispatch(setCartValue([]));
  };
};
// const emptyCart = () => {
//   return {
//     type: EMPTY_CART
//   };
// };

const setCartValue = val => {
  return {
    type: SET_CART_VALUE,
    val
  };
};
export const fetchAllCartItems = () => {
  return dispatch => {
    dispatch(setCartValue(0));
    let cart = localStorage.getItem('cart-sama');
    if (!cart) {
      dispatch(setCartValue([]));
      return console.log('there are no items in the cart');
    }

    let urls;
    let cartToJson = JSON.parse(cart);
    urls = Object.keys(cartToJson).map(c => {
      return `${App.domain}api/userproducts/details/${c}`;
    });
    Promise.all(
      urls.map(
        url =>
          new Promise((resolve, reject) => {
            axios
              .get(url)

              .then(res => {
                // console.log(res.data);
                // console.log(res);
                if (res.data.deleteId) {
                  // console.log('na null oo');
                  dispatch(
                    initiateDeleteItemFromCart({ productId: res.data.deleteId })
                  );
                }
                // if (res.data.productName) {
                else if (res.data.productName) {
                  resolve({
                    ...res.data,
                    quantity:
                      cartToJson[url.split('/')[url.split('/').length - 1]]
                  });
                }
                // }
              })
              .catch(err => {
                // console.log(err.response);
                console.log('probably did not see the cart');
                dispatch(setCartValue('Error occured'));

                reject(err.response);
              });
          })
      )
    )
      .then(data => {
        console.log('please');
        // console.log(data, 'from cart');
        dispatch(setCartValue(data));
      })
      .catch(error => {
        console.log(error);
      });
  };
};
const editQuantHandler = prodData => {
  return { type: EDIT_CART_QUANTITY, prodData };
};
const startCartEdit = () => {
  return { type: START_CART_EDIT };
};
export const editAndRefreshCart = (prodData, isEdit) => {
  return dispatch => {
    dispatch(startCartEdit());
    dispatch(initiateAddToCart(prodData, isEdit));
    dispatch(editQuantHandler(prodData));
  };
};

export const initiateDeleteItemFromCart = prodData => {
  return dispatch => {
    let cart = localStorage.getItem('cart-sama');
    const { productId } = prodData;
    if (cart) {
      let cartToJson = JSON.parse(cart);
      let editedJsonCart = {
        ...cartToJson,
        [productId]: undefined
      };
      let stringData = JSON.stringify(editedJsonCart);
      localStorage.setItem('cart-sama', stringData);
      dispatch(deleteFromCart(productId));
      dispatch(addToCart(JSON.parse(stringData)));
    }
  };
};
export const deleteFromCart = id => {
  return {
    type: DELETE_FROM_CART,
    id
  };
};

export const initiateAddToCart = (prodData, isEdit) => {
  return dispatch => {
    // dispatch(productFetchStart());
    let cart = localStorage.getItem('cart-sama');
    const { quantity, productId, fullProduct } = prodData;
    if (!cart) {
      let dataToStore = { [productId]: quantity };
      let stringData = JSON.stringify(dataToStore);
      localStorage.setItem('cart-sama', stringData);
      dispatch(addToCart(dataToStore, fullProduct));
    } else {
      let cartToJson = JSON.parse(cart);
      let editedCart;
      if (!isEdit) {
        editedCart = {
          ...cartToJson,
          [productId]: cartToJson[productId]
            ? cartToJson[productId] + quantity
            : quantity
        };
      } else {
        editedCart = {
          ...cartToJson,
          [productId]: quantity
        };
      }

      let stringData = JSON.stringify(editedCart);
      localStorage.removeItem('cart-sama');
      localStorage.setItem('cart-sama', stringData);
      dispatch(addToCart(editedCart, fullProduct));
    }
  };
};
