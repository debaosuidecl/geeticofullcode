import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import authReducer from './reducers/auth';
import cartReducer from './reducers/cart';
import thunk from 'redux-thunk';
const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer
});
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
