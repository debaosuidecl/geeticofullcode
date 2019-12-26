import React, { Component } from 'react';
import SellerBackendLayout from '../../../components/UI/sellerBackendLayout/sellerBackendLayout';
import classes from './OrderManagement.module.css';

import Backdrop from '../../../components/UI/Backdrop/Backdrop';
import Spinner from '../../../components/UI/Spinner/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import App from '../../../App';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import OrderCard from '../../../components/OrderCard/OrderCard';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
// import Modal from '../../../components/UI/Modal/Modal';

export class OrdersManagement extends Component {
  state = {
    page: 2,
    orders: [],
    hasMore: true,
    loading: true,
    isCollapsed: true,
    pathToFetch: ''
  };
  componentDidMount() {
    window.scrollTo(0, 0);

    console.log(this.props.match.path);
    if (this.props.match.path === '/sellerpage/order/processing') {
      this.setState({ pathToFetch: 'processing' });
      this.initFetch('processing');
    } else if (this.props.match.path === '/sellerpage/order/shipped') {
      console.log('shipped matched bro');
      this.setState({ pathToFetch: 'shipped' });
      this.initFetch('shipped');
    } else if (
      this.props.match.path === '/sellerpage/order/awaiting-verification'
    ) {
      this.setState({ pathToFetch: 'awaiting verification' });
      this.initFetch('awaiting verification');
    } else if (
      this.props.match.path === '/sellerpage/order/verification-in-progress'
    ) {
      this.setState({ pathToFetch: 'verification in progress' });
      this.initFetch('verification in progress');
    } else if (this.props.match.path === '/sellerpage/order/delivered') {
      this.setState({ pathToFetch: 'delivered' });

      this.initFetch('delivered');
    } else {
      this.initFetch('');
    }
  }

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
      `${App.domain}api/userorders/all/1?${status ? 'status=' + status : ''}`,
      config
    );
    console.log(firstresp.data);

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
      `${App.domain}api/userorders/all/${this.state.page}?${
        this.state.pathToFetch ? 'status=' + this.state.pathToFetch : ''
      }`,
      config
    );
    console.log(firstresp.data);
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
  setLoadingHandler = () => {
    this.setState(p => {
      return {
        loading: !p.loading
      };
    });
  };

  render() {
    let ordersBeingDisplay = this.props.match.path.split('/')[
      this.props.match.path.split('/').length - 1
    ];
    // console.log(ordersBeingDisplay, 'odbasd');
    let loadingStage = (
      <div className=''>
        <Backdrop forceWhite show={true} />

        <div className={classes.spinnerCont}>
          <Spinner />
        </div>
      </div>
    );

    let authRedirect =
      this.props.isAuthenticated && this.props.hasFinishedLoading ? null : !this
          .props.isAuthenticated && this.props.hasFinishedLoading ? (
        <Redirect to={`/?auth=true&redirect=orders`} />
      ) : null;
    return (
      <SellerBackendLayout>
        {this.state.loading ? loadingStage : null}
        {authRedirect}
        {/* {this.state.successfulOrder ? successModal : null} */}
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
                      this.props.history.push('/sellerpage/order');
                    }}
                  />
                  <Dropdown.Item
                    text=' Processing'
                    onClick={() => {
                      this.props.history.push('/sellerpage/order/processing');
                    }}
                  />
                  <Dropdown.Item
                    text='Shipped'
                    onClick={() => {
                      this.props.history.push('/sellerpage/order/shipped');
                    }}
                  />
                  <Dropdown.Item
                    text='Delivered'
                    onClick={() => {
                      this.props.history.push('/sellerpage/order/delivered');
                    }}
                  />
                  <Dropdown.Item
                    text='Awaiting Verification'
                    onClick={() => {
                      this.props.history.push(
                        '/sellerpage/order/awaiting-verification'
                      );
                    }}
                  />

                  <Dropdown.Item
                    text='Verification in Progress'
                    onClick={() => {
                      this.props.history.push(
                        '/sellerpage/order/verification-in-progress'
                      );
                    }}
                  />

                  {/* <Dropdown.Divider /> */}
                </Dropdown.Menu>
              </Dropdown>

              <p>Orders are displayed according to urgency</p>
            </div>
            <div className={classes.displayCont}>
              {ordersBeingDisplay === 'order' ? (
                <p className={classes.displayOrderText}>
                  Displaying all Orders
                </p>
              ) : (
                <p className={classes.displayOrderText}>
                  showing {ordersBeingDisplay} Orders
                </p>
              )}{' '}
            </div>
            {this.state.loading === false && this.state.orders.length <= 0 ? (
              <p className={classes.NoOrders}>There are no orders</p>
            ) : null}
            <InfiniteScroll
              dataLength={this.state.orders.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
              loader={<div style={{ textAlign: 'center' }}>...</div>}
              endMessage={
                <p style={{ textAlign: 'center', fontWeight: 100 }}>
                  <b>End of orders</b>
                </p>
              }
            >
              <div className={classes.Container}>
                {this.state.orders.length > 0 &&
                  this.state.orders.map((order, i) => {
                    return (
                      <OrderCard
                        key={i}
                        setLoadingHandler={this.setLoadingHandler}
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
      </SellerBackendLayout>
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
export default connect(mapStateToProps)(OrdersManagement);
// export default OrdersManagement;
