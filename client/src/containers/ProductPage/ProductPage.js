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
import Canned from '../../shared/images/Canned, Jarred & Packaged Foods.jpg';
import 'semantic-ui-css/semantic.min.css';
import SpinnerTwo from '../../components/UI/Spinner2/Spinner2';
import { connect } from 'react-redux';
import { initiateAddToCart } from '../../store/actions/cart';
import App from '../../App';

class ProductPage extends React.Component {
  state = {
    page: 2,
    products: [],
    breakfast: [],
    hottestDeals: [],
    cooking: [],
    hasMore: true
  };
  static allowedCategories = [
    'Beer, Wine & Spirit',
    'Food Cupboard',
    'Beverages',
    'Drinks',
    'Cooking & Baking',
    'Dried Beans, Grains & Rice',
    'Breakfast Foods',
    'Herbs Spices & Seasoning',
    'Candy & Chocolate',
    'Canned, Jarred & Packaged Foods',
    'Jams, Jellies & Sweet Spreads',
    'Condiments & Salad Dressings'
  ];
  componentDidMount() {
    axios.get(`${App.domain}api/userproducts/1?search=cooking`).then(res => {
      // console.log(res.data);

      this.setState({
        cooking: res.data
      });
    });
    axios.get(`${App.domain}api/userproducts/1?search=breakfast`).then(res => {
      // console.log(res.data);

      this.setState({
        breakfast: res.data
      });
    });

    axios
      .get(`${App.domain}api/userproducts/1`)
      .then(res => {
        // console.log(res.data);
        this.setState(prevState => {
          return {
            // page: prevState.page + 1,
            hottestDeals: prevState.products.concat(res.data)
            // hasMore: res.data.length > 0
          };
        });
      })
      .catch(err => {
        // console.log(err.response);
      });
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
  render() {
    return (
      <div>
        <Layout>
          <div style={{ paddingTop: '120px' }}>
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
                  className={classes.item10}
                  onClick={() => this.goToCatHandler('Beer, Wine & Spirit')}
                >
                  <img src={Beers} alt='' />
                </div>
                <div
                  className={classes.item11}
                  onClick={() => this.goToCatHandler('Cooking & Baking')}
                >
                  <img src={bake} alt='' />
                </div>
                <div
                  className={classes.item12}
                  onClick={() => this.goToCatHandler('Candy & Chocolate')}
                >
                  <img src={Choco} alt='' />
                </div>
              </div>
            </div>
          </div>

          {['breakfast', 'cooking'].map(search => {
            return this.state[search].length > 0 ? (
              <React.Fragment>
                <div className={classes.HeaderProdCont}>
                  <h2 className={classes.ProductHeader}>
                    {search.toUpperCase()}
                  </h2>
                  <p onClick={() => this.searchMoreOption(search)}>View More</p>
                </div>
                <div className={classes['scrolling-wrapper']}>
                  {this.state[search].length > 0 &&
                    this.state[search].map((item, i) => (
                      <span className=''>
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
                          productURL={`${App.domain}public/${
                            item.productURL[0]
                          }`}
                          desc={item.desc}
                          id={item._id}
                          productName={item.productName}
                          price={item.price}
                          key={`key-${i}`}
                        />
                      </span>
                    ))}
                </div>
              </React.Fragment>
            ) : null;
          })}
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProductPage)
);
