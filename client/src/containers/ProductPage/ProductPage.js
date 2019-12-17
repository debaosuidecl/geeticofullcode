import React from 'react';
import Layout from '../../components/UI/Layout/Layout';
import classes from './ProductPage.module.css';
// import Carousel from '../../components/CarouselSlider/CarouselSlider';
// // import MultiCarousel from '../../components/MultiCarousel/MultiCarousel';
import CarouselCard from '../../components/CarouselCard/CarouselCard';
import { withRouter } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

import Breakfast from '../../shared/images/breakfast foods.jpg';
import Beverages from '../../shared/images/beverages.jpg';
import Herbs from '../../shared/images/Herbs spice seasoning.jpg';
import Drinks from '../../shared/images/drinks.jpg';
import SweetSpreads from '../../shared/images/sweet spreads.jpg';
import Beans from '../../shared/images/beans rice grains.jpg';
import Beers from '../../shared/images/beer wines and spirit.jpg';
import bake from '../../shared/images/cooking & baking.jpg';
import cupboard from '../../shared/images/food cupboard.jpg';
import SaladSpread from '../../shared/images/salad spread.jpg';
import Choco from '../../shared/images/Candy&Chocolate.jpg';
import household from '../../shared/images/household.jpg';
import Canned from '../../shared/images/Canned, Jarred & Packaged Foods.jpg';
import 'semantic-ui-css/semantic.min.css';
import SpinnerTwo from '../../components/UI/Spinner2/Spinner2';
import Spinner from '../../components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import { initiateAddToCart } from '../../store/actions/cart';
import App from '../../App';

class ProductPage extends React.Component {
  state = {
    page: 2,
    products: [],
    'Household Supplies': [],
    hottestDeals: [],
    cooking: [],
    hasMore: true
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    axios
      .get(`${App.domain}api/userproducts/1?search=cooking&excludeCat=true`)
      .then(res => {
        // console.log(res.data);

        axios
          .get(`${App.domain}api/userproducts/1?search=household`)
          .then(res222 => {
            // console.log(res.data);
            console.log(res.data, 'res');
            console.log(res222.data, 'res2');
            this.setState({
              cooking: res.data,
              'Household Supplies': res222.data
            });
          });
      });

    // axios
    //   .get(`${App.domain}api/userproducts/1`)
    //   .then(res => {
    //     // console.log(res.data);
    //     this.setState(prevState => {
    //       return {
    //         // page: prevState.page + 1,
    //         hottestDeals: prevState.products.concat(res.data)
    //         // hasMore: res.data.length > 0
    //       };
    //     });
    //   })
    //   .catch(err => {
    //     // console.log(err.response);
    //   });
  }

  fetchMoreData = () => {
    axios
      .get(`${App.domain}api/userproducts/${this.state.page}`)
      .then(res => {
        // console.log(res.data);
        this.setState(prevState => {
          return {
            page: prevState.page + 1,
            products: prevState.products.concat(res.data),
            hasMore: res.data.length > 0
          };
        });
      })
      .catch(err => {
        // console.log(err.response);
      });
  };

  goToDetailHandler = id => {
    this.props.history.push(`/details/${id}`);
  };
  goToCatHandler = cat => {
    this.props.history.push(`/category/${cat}`);
  };
  searchMoreOption = search => {
    this.props.history.push(`/search?search=${search}`);
  };
  generateSentence = string => {
    var sentence = string.toLowerCase().split(' ');
    for (var i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    console.log(sentence);
    return sentence.join(' ');
  };
  render() {
    return (
      <div>
        <Layout>
          <div style={{ paddingTop: '50px' }}>
            {/* <Carousel /> */}

            <div className={classes.GridCont}>
              <div className={classes['grid-container']}>
                <div
                  className={classes.item1}
                  onClick={() => this.goToCatHandler('Breakfast Foods')}
                >
                  <img src={Breakfast} alt='bf' />
                </div>
                <div
                  className={classes.item2}
                  onClick={() => this.goToCatHandler('Beverages')}
                >
                  <img src={Beverages} alt='bv' />
                </div>
                <div
                  className={classes.item3}
                  onClick={() =>
                    this.goToCatHandler('Dried Beans, Grains & Rice')
                  }
                >
                  <img src={Beans} alt='' />
                </div>
                <div
                  className={classes.item4}
                  onClick={() => this.goToCatHandler('Food Cupboard')}
                >
                  <img src={cupboard} alt='' />
                </div>
                <div
                  className={classes.item5}
                  onClick={() =>
                    this.goToCatHandler('Herbs Spices & Seasoning')
                  }
                >
                  <img src={Herbs} alt='bv' />
                </div>
                <div
                  className={classes.item6}
                  onClick={() => this.goToCatHandler('Drinks')}
                >
                  <img src={Drinks} alt='' />
                </div>
                <div
                  className={classes.item7}
                  onClick={() =>
                    this.goToCatHandler('Condiments & Salad Dressings')
                  }
                >
                  <img src={SaladSpread} alt='' />
                </div>
                <div
                  className={classes.item8}
                  onClick={() =>
                    this.goToCatHandler('Jams, Jellies & Sweet Spreads')
                  }
                >
                  <img src={SweetSpreads} alt='' />
                </div>
                <div
                  className={classes.item9}
                  onClick={() =>
                    this.goToCatHandler('Canned, Jarred & Packaged Foods')
                  }
                >
                  <img src={Canned} alt='' />
                </div>
                <div
                  className={classes.item15}
                  onClick={() => this.goToCatHandler('Household Supplies')}
                >
                  <img src={household} alt='' />
                </div>
                <div
                  className={classes.item10}
                  onClick={() => this.goToCatHandler('Beer, Wine & Spirit')}
                >
                  <img src={Beers} alt='' />
                </div>
                <div
                  className={classes.item11}
                  onClick={() =>
                    this.goToCatHandler('Cooking, Baking & Ingredients')
                  }
                >
                  <img src={bake} alt='' />
                </div>
                <div
                  className={classes.item12}
                  onClick={() =>
                    this.goToCatHandler('Biscuits, Candy & Chocolate')
                  }
                >
                  <img src={Choco} alt='' />
                </div>
              </div>
            </div>
          </div>
          <div className={classes.HeightSet}>
            {['cooking', 'Household Supplies'].map(search => {
              return this.state[search].length > 0 ? (
                <React.Fragment>
                  <div className={classes.scrollCover}>
                    <div className={classes.HeaderProdCont}>
                      <h2 className={classes.ProductHeader}>
                        {this.generateSentence(search)}
                      </h2>
                      <p onClick={() => this.searchMoreOption(search)}>More</p>
                    </div>
                    <div className={classes['scrolling-wrapper']}>
                      {this.state[search].length > 0 &&
                        this.state[search].map((item, i) => (
                          <span className='' key={i}>
                            <CarouselCard
                              goToDetail={() =>
                                this.props.history.push(`/details/${item._id}`)
                              }
                              isCarousel
                              addCart={() =>
                                this.props.onAddToCart({
                                  productId: item._id,
                                  quantity: 1,
                                  fullProduct: item
                                })
                              }
                              cart={this.props.cart}
                              productURL={`https://geetico.com/public/${item.productURL[0]}`}
                              desc={item.desc}
                              id={item._id}
                              productName={item.productName}
                              price={item.price}
                              key={`key-${i}`}
                            />
                          </span>
                        ))}
                    </div>
                  </div>
                </React.Fragment>
              ) : null;
            })}

            {this.state['Household Supplies'].length <= 0 ||
            this.state['cooking'].length <= 0 ? (
              <Spinner />
            ) : null}
          </div>
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    cart: state.cart.cartItems
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onAddToCart: prodData => dispatch(initiateAddToCart(prodData))
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductPage)
);
