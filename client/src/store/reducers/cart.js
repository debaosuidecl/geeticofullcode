import {
  ADD_TO_CART,
  SET_CART_VALUE,
  EDIT_CART_QUANTITY,
  START_CART_EDIT,
  DELETE_FROM_CART,
  SHOW_CART_PREVIEW
} from '../actions/actionTypes';
import { stat } from 'fs';

let initialState = {
  // loading: false,
  showCart: false,
  itemCount: 0,
  cartItems: 0,
  isEditing: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_CART_PREVIEW:
      return {
        ...state,
        showCart: !state.showCart
      };
    case ADD_TO_CART:
      return {
        ...state,
        isEditing: false,
        itemCount: Object.keys(action.cartData).length,
        cartItems:
          action.fullProduct &&
          Array.isArray(state.cartItems) &&
          state.cartItems.find(c => c._id === action.fullProduct._id) ===
            undefined
            ? [...state.cartItems, { ...action.fullProduct, quantity: 1 }]
            : state.cartItems
      };
    case START_CART_EDIT:
      return {
        ...state,
        isEditing: true
      };
    case DELETE_FROM_CART:
      return {
        ...state,
        // isEditing: true
        cartItems: [...state.cartItems].filter(i => i._id !== action.id)
      };
    case SET_CART_VALUE:
      return {
        ...state,
        isEditing: false,
        cartItems: action.val
        // itemCount: Object.keys(action.cartData).length
      };
    case EDIT_CART_QUANTITY:
      let itemsToEdit = [...state.cartItems];
      let indexToReplace = itemsToEdit.findIndex(
        i => i._id === action.prodData.productId
      );
      let itemToChange = itemsToEdit[indexToReplace];
      let newItem = {
        ...itemToChange,
        quantity: action.prodData.quantity
      };
      itemsToEdit[indexToReplace] = newItem;

      return {
        ...state,
        isEditing: false,
        cartItems: itemsToEdit
        // itemCount: Object.keys(action.cartData).length
      };

    default: {
      return state;
    }
  }
};

export default reducer;
