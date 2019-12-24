import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import productsReducer from './reducers/products';
import AuthReducer from './reducers/auth';
import NotificationsReducer from './reducers/notifications';
const rootReducer = combineReducers({
  prod: productsReducer,
  auth: AuthReducer,
  notification: NotificationsReducer
});
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
