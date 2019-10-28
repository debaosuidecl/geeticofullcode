import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import './FancyRoute.scss';

class FancyRoute extends Component {
  componentWillMount() {
    nprogress.start();
  }

  componentDidMount() {
    // setTimeout(() => {
    // console.log("loaded");
    nprogress.done();
    // }, 5000);
  }

  render() {
    return <Route {...this.props} />;
  }
}

export default FancyRoute;
