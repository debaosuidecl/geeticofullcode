import React, { Component } from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import { Link, withRouter } from 'react-router-dom';
import classes from './TopNavigationItems.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../UI/SearchBar/SearchBar';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

import { connect } from 'react-redux';
import { authLogOut } from '../../store/actions/auth';
import Logo from '../../shared/images/minimalist-01.png';
import App from '../../App';
import Backdrop from '../UI/Backdrop/Backdrop';
import { fetchAllCartItems, showCartPreview } from '../../store/actions/cart';
import CartPreview from '../CartPreview/CartPreview';
class NavigationItems extends Component {
  state = {
    search: '',
    suggestions: [],
    showDropDown: false
  };

  componentDidMount() {
    this.props.onFetchCartItems();
  }
  textChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
    // console.log(e.target.value);

    if (e.target.value.length > 2) {
      // console.log('go');
      axios
        .get(`${App.domain}api/userproducts/1?search=${e.target.value}`)
        .then(response => {
          // console.log(response);
          this.setState({ suggestions: response.data });
          if (response.data.length > 0) {
            this.setState({ showDropDown: true });
          } else {
            this.setState({ showDropDown: false });
          }
        })
        .catch(e => {
          console.log(e.response);
        });
    }
  };
  keyDownHandler = e => {};
  onBlurHandler = e => {
    this.setState({ showDropDown: false });
  };
  onFocusHandler = () => {
    this.setState({ showDropDown: true });
  };
  render() {
    const element = (
      <span className={classes.CartIconContainer}>
        <FontAwesomeIcon size='lg' icon={faCartArrowDown} />
      </span>
    );

    return (
      <ul className={classes.NavigationItems}>
        <Link to='/' style={{ display: 'flex' }}>
          <img src={Logo} width={40} alt='' style={{ marginRight: 10 }} />
          <h1 className={classes.Header}>Geetico.com</h1>
        </Link>

        <div className={classes.InputContainer}>
          <SearchBar
            search={this.state.search}
            clicked={() => {
              if (this.state.search.length > 2)
                window.location.href = `/search?search=${this.state.search}`;
            }}
            textChangeHandler={this.textChangeHandler}
            searchIcon={faSearch}
            keyDownHandler={this.keyDownHandler}
          />
          <div className={classes.editDrop} style={{ opacity: 0.3 }}>
            <Backdrop
              show={this.state.showDropDown}
              clicked={this.onBlurHandler}
            />
          </div>
          {this.state.showDropDown && this.state.suggestions.length > 0 ? (
            <div className={classes.suggestions}>
              {this.state.suggestions.length > 0 &&
                this.state.suggestions.map(sug => {
                  return (
                    <a key={sug._id} href={`/details/${sug._id}`}>
                      <div className={classes.singleSuggestion}>
                        <img
                          src={`${App.domain}public/${sug.productURL[0]}`}
                          className={classes.productImage}
                          alt=''
                        />
                        <p>{sug.productName}</p>
                      </div>
                    </a>
                  );
                })}
            </div>
          ) : null}
        </div>

        <div onClick={this.props.clickForModal}>
          {this.props.isAuthenticated ? null : (
            <NavigationItem
              linkType='ReactLink'
              to='#'
              className={classes.Help}
            >
              Login/Sign Up
            </NavigationItem>
          )}
        </div>
        {this.props.hideCheckoutDrop ? null : (
          <div className={classes.CheckOutDrop}>
            <button
              onClick={() => this.props.onToggleCartPreview()}
              className={classes.CheckoutButton}
            >
              {' '}
              {element}My Cart{' '}
              <span className={classes.CartNumber}>{this.props.itemCount}</span>
            </button>
            <CartPreview
              toggleCartPreview={this.props.onToggleCartPreview}
              showCart={this.props.showCart}
              cart={this.props.cart}
            />
          </div>
        )}

        {this.props.isAuthenticated ? (
          <img
            alt='avatar'
            width='40px'
            src={this.props.avatar}
            className={classes.avatar}
          />
        ) : null}
        {this.props.isAuthenticated ? (
          <span className={classes.fullName}>
            {' '}
            Hi {this.props.fullName.split(' ')[0]}!
          </span>
        ) : null}
        {this.props.isAuthenticated ? (
          <Dropdown text='' color='white'>
            <Dropdown.Menu>
              <Dropdown.Item
                icon='folder'
                text=' My Orders'
                onClick={() => {
                  // this.props.onLogout();
                  this.props.history.push('/orders');
                }}
                // description='track your orders'
              />

              <Dropdown.Divider />
              <Dropdown.Item
                icon='user'
                text='Logout'
                onClick={() => {
                  this.props.onLogout();
                  this.props.history.push('/');
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        ) : null}
      </ul>
    );
  }
}
const mapStateToProps = state => {
  return {
    // itemCount: state.cart.itemCount,
    isAuthenticated: state.auth.token !== null,
    showCart: state.cart.showCart,
    fullName: state.auth.fullName,
    cart: state.cart.cartItems,
    email: state.auth.email,
    avatar: state.auth.avatar
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogOut()),
    onFetchCartItems: () => dispatch(fetchAllCartItems()),
    onToggleCartPreview: () => dispatch(showCartPreview())
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavigationItems)
);
