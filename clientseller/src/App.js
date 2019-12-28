import React, { Component } from 'react';
import './App.css';
import FancyRoute from './FancyRoute';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router-dom';
import { authCheckState } from './store/actions/auth';
import LoadingPage from './containers/LoadingPage/LoadingPage';
import routes from './routes';
import nonAuthRoute from './nonAuthRoute';
import ProductAddCard from './components/ProductAddCard/ProductAddCard';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignIn();
  }
  static allowedCategories = [
    'Beer, Wine & Spirit',
    'Food Cupboard',
    'Beverages',
    'Drinks',
    'Cooking, Baking & Ingredients',
    'Dried Beans, Grains & Rice',
    'Breakfast Foods',
    'Herbs Spices & Seasoning',
    'Biscuits, Candy & Chocolate',
    'Canned, Jarred & Packaged Foods',
    'Jams, Jellies & Sweet Spreads',
    'Condiments & Salad Dressings',
    'Household Supplies'
  ];
  static baseName = '/seller/';
  // static domain = 'http://localhost:5000/';
  static domain =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:2950/'
      : 'https://seller.geetico.com/';
  static valueToHours = value => {
    switch (value) {
      case 1:
        return 9;
      case 2:
        return 12;
      case 3:
        return 15;
      case 4:
        return 18;

      default:
        return '';
    }
  };
  render() {
    let appRoute = '';
    if (this.props.isAuthenticated) {
      appRoute = (
        <div style={{ marginTop: 0 }}>
          {this.props.productAddSuccess ? <ProductAddCard /> : null}
          <Switch>
            {routes.map((route, i) => (
              <FancyRoute key={i} {...route} />
            ))}
            {/* <Redirect to='/' /> */}
            {/* <Redirect to='/sellerpage/dashboard' /> */}
            {/* <Route path='*' component={LoadingPage} /> */}
          </Switch>
        </div>
      );
    } else {
      appRoute = (
        <Switch>
          {nonAuthRoute.map((route, i) => (
            <FancyRoute key={i} {...route} />
          ))}
          {/* <Redirect to='/' /> */}
        </Switch>
      );
    }
    // return appRoute;
    return this.props.authCheck ? <LoadingPage /> : appRoute;
  }
}

const mapStateToProps = state => {
  // console.log(state, 'from App.js');
  return {
    isAuthenticated: state.auth.token !== null,
    authCheck: state.auth.authCheckLoading,
    productAddSuccess: state.prod.showSuccessTag
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignIn: () => dispatch(authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
// export default App;
