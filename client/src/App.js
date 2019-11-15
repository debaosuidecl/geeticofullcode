import React, { Component } from 'react';
import './App.css';
import FancyRoute from './FancyRoute';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router-dom';
import { authCheckState } from './store/actions/auth';
import LoadingPage from './containers/LoadingPage/LoadingPage';
import nonAuthRoute from './nonAuthRoute';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignIn();
  }
  // static isDevelopment = false;
  // static domain = '/';
  static domain =
    process.env.NODE_ENV === 'development' ? 'http://localhost:2900/' : '/';
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
  static lagos = [
    'Agege',
    'Ajeromi-Ifelodun',
    'Alimosho',
    'Amuwo-Odofin',
    'Badagry',
    'Apapa',
    'Epe',
    'Eti Osa',
    'Ibeju-Lekki',
    'Ifako-Ijaiye',
    'Ikeja',
    'Ikorodu',
    'Kosofe',
    'Lagos Island',
    'Mushin',
    'Lagos Mainland',
    'Ojo',
    'Oshodi-Isolo',
    'Shomolu',
    'Surulere Lagos State'
  ];
  static hours = [
    { displayValue: '7am - 9am', value: 1 },
    { displayValue: '9am - 11am', value: 2 },
    { displayValue: '11am - 1pm', value: 3 },
    { displayValue: '1pm - 3pm', value: 4 },
    { displayValue: '3pm - 5pm', value: 5 },
    { displayValue: '5pm - 7pm', value: 6 }
  ];
  static valueToHours = value => {
    switch (value) {
      case 1:
        return 9;
      case 2:
        return 11;
      case 3:
        return 13;
      case 4:
        return 15;
      case 5:
        return 17;
      case 6:
        return 18;
      default:
        return 0;
    }
  };
  render() {
    // console.log('props from App.js', this.props);
    let appRoute = '';
    // if (this.props.isAuthenticated) {
    appRoute = (
      <div style={{ marginTop: 0 }} id='TNV'>
        {/* {this.props.productAddSuccess ? <ProductAddCard /> : null} */}
        <Switch>
          {nonAuthRoute.map((route, i) => {
            return <FancyRoute key={i} {...route} />;
          })}

          {/* <Route path='*' component={LoadingPage} /> */}
        </Switch>
      </div>
    );
    return this.props.authCheck ? <LoadingPage /> : appRoute;

    // return appRoute;
  }
}

const mapStateToProps = state => {
  // console.log(state, 'from App.js');
  return {
    isAuthenticated: state.auth.token !== null,
    authCheck: state.auth.authCheckLoading
    // productAddSuccess: state.prod.showSuccessTag
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignIn: () => dispatch(authCheckState())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
// export default App;
