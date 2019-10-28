import React from 'react';
import classes from './MobileNavContainer.module.css';
import SearchBar from '../../components/UI/SearchBar/SearchBar';
import Toggler from '../../components/UI/Toggler/Toggler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import {
  faSearch,
  faBookOpen,
  faCoffee,
  faEgg,
  faWineBottle,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import App from '../../App';
import axios from 'axios';
import { showCartPreview, fetchAllCartItems } from '../../store/actions/cart';
import { authLogOut } from '../../store/actions/auth';
import { connect } from 'react-redux';
import CartPreview from '../../components/CartPreview/CartPreview';

const navContainerArray = [classes.NavContainer, classes.MobileOnly];

class NavContainer extends React.Component {
  state = {
    navIcons: [
      { iconlink: faBookOpen, desc: 'Browse All', link: '/' },
      { iconlink: faCoffee, desc: 'Beverages', link: '/category/Beverages' },
      { iconlink: faEgg, desc: 'Breakfast', link: '/category/Breakfast Foods' },
      { iconlink: faWineBottle, desc: 'Drinks', link: '/category/Drinks' }
    ],
    search: '',
    suggestions: [],
    showDropDown: false
  };

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
          // console.log(e.response);
        });
    }
  };

  onBlurHandler = e => {
    this.setState({ showDropDown: false });
  };
  onFocusHandler = () => {
    this.setState({ showDropDown: true });
  };
  render() {
    return (
      <div className={navContainerArray.join(' ')}>
        <div className={classes.TopMobileNavItem}>
          <div className={classes.TogglerLogoCont}>
            <Toggler
              isToggled={this.props.isToggled}
              clicked={this.props.clicked}
            />
            <h1
              className={classes.Header}
              onClick={() => this.props.history.push('/')}
            >
              Geetico.com
            </h1>
          </div>
          <div className={classes.CheckoutIconContainer}>
            {this.props.isAuthenticated ? (
              <img
                alt='avatar'
                width='30px'
                src={this.props.avatar}
                className={classes.avatar}
              />
            ) : null}

            {this.props.hideCheckoutDrop ? null : (
              <div className={classes.CheckoutIcon}>
                <span onClick={() => this.props.onToggleCartPreview()}>
                  <FontAwesomeIcon
                    className={classes.shoppingCart}
                    icon={faShoppingCart}
                  />
                  <p className={classes.Counter}>{this.props.itemCount}</p>
                </span>
              </div>
            )}
            <CartPreview
              toggleCartPreview={this.props.onToggleCartPreview}
              showCart={this.props.showCart}
              cart={this.props.cart}
            />
          </div>
        </div>
        <div className={classes.SearchContainer}>
          <a href={`/search?search=${this.state.search}`}> </a>
          <SearchBar
            search={this.state.search}
            textChangeHandler={this.textChangeHandler}
            searchIcon={faSearch}
            clicked={() => {
              if (this.state.search.length > 2) {
                document
                  .querySelector(`[href="/search?search=${this.state.search}"]`)
                  .click();
              }
            }}
            keyDownHandler={this.keyDownHandler}
          />
          <div className='' style={{ opacity: 0 }}>
            <Backdrop
              show={this.state.showDropDown}
              clicked={this.onBlurHandler}
              forceWhite
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
        <div className={classes.IconNavItems}>
          {this.state.navIcons.map((icon, i) => (
            <a href={icon.link} rel='noreferrer' key={`${icon}${i}`}>
              <div
                className={classes.NavIcon}

                // onClick={() => this.props.history.push(`${icon.link}`)}
              >
                <FontAwesomeIcon size='1x' icon={icon.iconlink} />
                <p>{icon.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }
}

// export default withRouter(NavContainer);
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavContainer)
);
