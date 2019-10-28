import React, { Component } from 'react';
import Layout from '../../components/UI/Layout/Layout';
import classes from './OrderPage.module.css';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Spinner from '../../components/UI/Spinner/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import App from '../../App';
// import SpinnerTwo from '../../components/UI/Spinner2/Spinner2';
import queryString from 'query-string';
import success from '../../shared/images/success.png';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import OrderCard from '../../components/OrderCard/OrderCard';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Modal from '../../components/UI/Modal/Modal';
export class OrderPage extends Component {
  state = {
    page: 2,
    orders: [],
    hasMore: true,
    loading: true,
    isCollapsed: true,
    pathToFetch: ''
  };

  componentDidMount() {
    if (
      queryString.parse(this.props.location.search).orderId &&
      this.props.isAuthenticated
    ) {
      this.successOrderHandler();
    }
    // console.log(this.props);
    if (this.props.match.path === '/orders/processing') {
      this.setState({ pathToFetch: '/processing' });
      this.initFetch('/processing');
    } else if (this.props.match.path === '/orders/shipped') {
      console.log('shipped matched bro');
      this.setState({ pathToFetch: '/shipped' });
      this.initFetch('/shipped');
    } else if (this.props.match.path === '/orders/delivered') {
      this.setState({ pathToFetch: '/delivered' });

      this.initFetch('/delivered');
    } else {
      this.initFetch('/');
    }
  }
  successOrderHandler = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return console.log('no access');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    let url = `${App.domain}api/userorders/single/${
      queryString.parse(this.props.location.search).orderId
    }`;
    try {
      await axios.get(url, config);
      this.setState({ successfulOrder: true });
    } catch (error) {
      // console.log(error);
    }
  };
  initFetch = async status => {
    const token = localStorage.getItem('token');

    if (!token) {
      return console.log('no access');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    let firstresp = await axios.get(
      `${App.domain}api/userorders${status}/1`,
      config
    );
    // console.log(firstresp.data);
    this.setState(prevState => {
      return {
        loading: false,
        // page: prevState.page + 1,
        orders: prevState.orders.concat(firstresp.data),
        hasMore: firstresp.data.length > 0
      };
    });
  };
  fetchMoreData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return console.log('no access');
    }
    let config = {
      headers: {
        'x-auth-token': token
      }
    };
    let firstresp = await axios.get(
      `${App.domain}api/userorders${this.state.pathToFetch}/${this.state.page}`,
      config
    );
    // console.log(firstresp.data);
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
        orders: prevState.orders.concat(firstresp.data),
        hasMore: firstresp.data.length > 0
      };
    });
  };
  collapseHandler = () => {
    this.setState(p => {
      return {
        isCollapsed: !p.isCollapsed
      };
    });
  };
  render() {
    let loadingStage = (
      <div className=''>
        <Backdrop forceWhite show={true} />

        <div className={classes.spinnerCont}>
          <Spinner />
        </div>
      </div>
    );
    let successModal = (
      <Modal show removeModal={() => this.setState({ successfulOrder: false })}>
        <div className={classes.OrderSuccess}>
          <img src={success} alt='' />
          <p>Your order was successful!</p>
          <p>We will be in touch shortly</p>
        </div>
      </Modal>
    );
    let authRedirect =
      this.props.isAuthenticated && this.props.hasFinishedLoading ? null : !this
          .props.isAuthenticated && this.props.hasFinishedLoading ? (
        <Redirect to={`/?auth=true&redirect=orders`} />
      ) : null;

    let ordersBeingDisplay = this.props.match.path.split('/')[
      this.props.match.path.split('/').length - 1
    ];
    return (
      <Layout hideFooter>
        {' '}
        {this.state.loading ? loadingStage : null}
        {authRedirect}
        {this.state.successfulOrder ? successModal : null}
        <div className={classes.OrderCont}>
          <div className={classes.OrderCard}>
            <div className={classes.OrderHeader}>
              <h2>Your Orders</h2>
              <Dropdown
                text='Filter'
                icon='filter'
                style={{
                  color: '#777',
                  border: '1px solid #bbb',
                  padding: '4px',
                  borderRadius: '3px'
                }}
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    text=' All'
                    onClick={() => {
                      // this.props.onLogout();
                      this.props.history.push('/orders');
                    }}
                    // description='track your orders'
                  />
                  <Dropdown.Item
                    // icon='folder'
                    text=' Processing'
                    onClick={() => {
                      // this.props.onLogout();
                      this.props.history.push('/orders/processing');
                    }}
                    // description='track your orders'
                  />
                  <Dropdown.Item
                    // icon='folder'
                    text='Shipped'
                    onClick={() => {
                      // this.props.onLogout();
                      this.props.history.push('/orders/shipped');
                    }}
                    // description='track your orders'
                  />
                  <Dropdown.Item
                    // icon='folder'
                    text='Delivered'
                    onClick={() => {
                      // this.props.onLogout();
                      this.props.history.push('/orders/delivered');
                    }}
                    // description='track your orders'
                  />

                  <Dropdown.Divider />
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className={classes.displayCont}>
              {ordersBeingDisplay === 'orders' ? (
                <p className={classes.displayOrderText}>
                  Displaying all Orders
                </p>
              ) : (
                <p className={classes.displayOrderText}>
                  showing {ordersBeingDisplay} Orders
                </p>
              )}{' '}
            </div>

            <InfiniteScroll
              dataLength={this.state.orders.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
              loader={
                <div style={{ textAlign: 'center' }}>
                  {/* //   <SpinnerTwo /> */}
                  ...
                </div>
              }
              endMessage={
                <p style={{ textAlign: 'center', fontWeight: 100 }}>
                  <b>.</b>
                </p>
              }
            >
              <div className={classes.Container}>
                {/* <div className={classes.Or}></div> */}
                {this.state.orders.length > 0 &&
                  this.state.orders.map((order, i) => {
                    return (
                      <OrderCard
                        key={i}
                        order={order}
                        isCollapsed={this.state.isCollapsed}
                        collapseHandler={this.collapseHandler}
                      />
                    );
                  })}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    authCheck: state.auth.authCheckLoading,
    hasFinishedLoading: state.auth.firstLoad === 1
  };
};
export default connect(mapStateToProps)(OrderPage);
