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
    'Beer, Wine and Spirit',
    'Beverages',
    'Drinks',
    'Cooking, Spices and Baking Ingredients',
    // 'Cooking, Baking & Ingredients',
    // 'Herbs Spices & Seasoning',
    // 'Dried Beans, Grains & Rice',
    'Food Cupboard and Breakfast Food',
    // 'Food Cupboard',
    // 'Breakfast Foods',
    'Biscuits, Candy and Chocolate',
    'Jams, Canned and Packaged Condiments',
    // 'Canned, Jarred & Packaged Foods',
    // 'Jams, Jellies & Sweet Spreads',
    // 'Condiments & Salad Dressings',
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
    // { displayValue: '7am - 10am', value: 1 },
    { displayValue: '10am - 1pm', value: 2 },
    { displayValue: '1pm - 4pm', value: 3 },
    { displayValue: '4pm - 7pm', value: 4 }
  ];
  static valueToHours = value => {
    switch (value) {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
// export default App;
