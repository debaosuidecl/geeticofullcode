import React, { Component } from 'react';
import Layout from '../../components/UI/Layout/Layout';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import classes from './ProductSearchPage.module.css';
import SpinnerTwo from '../../components/UI/Spinner2/Spinner2';
import CarouselCard from '../../components/CarouselCard/CarouselCard';
import { connect } from 'react-redux';
import App from '../../App';
import { initiateAddToCart } from '../../store/actions/cart';
import queryString from 'query-string';

export class CategoryPage extends Component {
  state = {
    page: 2,
    products: [],
    hasMore: true,
    catProps: this.props.match.params.category
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ catProps: nextProps.match.params.category });
    if (nextProps.match.params.category !== this.props.match.params.category) {
      const currentProductId = nextProps.match.params.category;

      document.querySelector('[href="#TNV"]').click();

      axios
        .get(`${App.domain}api/userproducts/category/${currentProductId}/1`)

        .then(res => {
          // console.log(res);
          this.setState(prevState => {
            return {
              // loading: false,
              products: [...res.data],
              hasMore: res.data.length > 0 ? true : false,
              page: 2
              // page: 2
            };
          });
        })
        .catch(e => {
          // console.log(e.response.data);
        });
    }
    this.setState({ catProps: nextProps.match.params.category });
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    // document.querySelector('[href="#TNV"]').click();
    if (queryString.parse(this.props.location.search).search) {
      axios
        .get(
          `${App.domain}api/userproducts/1?search=${
            queryString.parse(this.props.location.search).search
          }`
        )

        .then(res => {
          // console.log(res);
          this.setState(prevState => {
            return {
              // loading: false,
              products: prevState.products.concat(res.data),
              hasMore: res.data.length > 0 ? true : false
              // page: 2
            };
          });
        })
        .catch(e => {
          // console.log(e.response.data);
        });
    }
  }
  refresh = () => {
    // document.querySelector('[href="#TNV"]').click();

    axios
      .get(
        `${App.domain}api/userproducts/${this.state.page}?search=${
          queryString.parse(this.props.location.search).search
        }`
      )

      .then(res => {
        // console.log(res);
        this.setState(prevState => {
          return {
            // loading: false,
            products: { ...res.data },
            hasMore: res.data.length > 0 ? true : false
            // page: 2
          };
        });
      })
      .catch(e => {
        // console.log(e.response.data);
      });
  };
  fetchMoreData = () => {
    // console.log(this.state.catProps, 'fetching for this');

    axios
      .get(
        `${App.domain}api/userproducts/${this.state.page}?search=${
          queryString.parse(this.props.location.search).search
        }`
      )

      .then(res => {
        // console.log(res);
        this.setState(prevState => {
          return {
            // loading: false,
            products: prevState.products.concat(res.data),
            hasMore: res.data.length > 0 ? true : false,
            page: prevState.page + 1
          };
        });
      })
      .catch(e => {
        // console.log(e.response.data);
      });
  };
  render() {
    return (
      // <div>
      <Layout hideFooter>
        {/* <a href='#TNV'> </a> */}
        <h2 className={classes.CategoryPage}>
          Showing results for{' '}
          {queryString.parse(this.props.location.search).search}
        </h2>
        {this.state.products.length > 0 ? (
          <InfiniteScroll
            refreshFunction={this.refresh}
            pullDownToRefresh
            pullDownToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &#8593; Release to refresh
              </h3>
            }
            dataLength={this.state.products.length}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={
              <div style={{ textAlign: 'center', marginBottom: 100 }}>
                <SpinnerTwo />
              </div>
            }
            endMessage={
              <p
                style={{
                  textAlign: 'center',
                  color: '#333'
                }}
              >
                End of Results
              </p>
            }
          >
            <div className={classes.ProductsCont}>
              {this.state.products.length > 0 &&
                !this.state.products.msg &&
                this.state.products.map(p => (
                  <CarouselCard
                    cart={this.props.cart}
                    key={p._id}
                    id={p._id}
                    productURL={`${App.domain}public/${p.productURL[0]}`}
                    productName={p.productName}
                    price={p.price}
                    addCart={() =>
                      this.props.onAddToCart({
                        productId: p._id,
                        fullProduct: p,
                        quantity: 1
                      })
                    }
                    goToDetail={() =>
                      this.props.history.push(`/details/${p._id}`)
                    }
                  />
                ))}
            </div>
          </InfiniteScroll>
        ) : null}
      </Layout>
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
  connect(mapStateToProps, mapDispatchToProps)(CategoryPage)
);
