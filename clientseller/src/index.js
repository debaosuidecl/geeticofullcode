import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { store } from "./store/createdStore";
import './index.css';
import App from './App';
import store from './store/index';
import { Provider } from 'react-redux';
// import registerServiceWorker from "./registerServiceWorker";

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
// registerServiceWorker();
