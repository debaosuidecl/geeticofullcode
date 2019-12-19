import React from 'react';
import classes from './Layout.module.css';

import NavContainer from '../../../containers/NavContainer/NavContainer';
import TopNavContainer from '../../../containers/TopNavContainer/TopNavContainer';
import MobileNavContainer from '../../../containers/MobileNavContainer/MobileNavContainer';
import SideDrawer from '../../SideDrawer/SideDrawer';
import Modal from '../Modal/Modal';
// import Backdrop from "../Backdrop/Backdrop";
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { fetchCart } from '../../../store/actions/cart';
import AuthCont from '../../AuthCont/AuthCont';
import {
  toggleAuthModalAction,
  setAuthModalToTrue
} from '../../../store/actions/auth';
import FooterPage from '../Footer/Footer';

class Layout extends React.Component {
  state = {
    shouldSlideIn: false,
    showModal: false,
    slideMenu: true,
    lastScrollTop: 0
  };

  componentDidMount() {
    if (
      queryString.parse(this.props.location.search).redirect === 'checkout' &&
      this.props.isAuthenticated
    ) {
      this.props.history.push('/checkout');

      // this.props.onSetAuthModalToTrue();
    } else if (
      queryString.parse(this.props.location.search).redirect === 'orders' &&
      this.props.isAuthenticated
    ) {
      this.props.history.push('/orders');
    }
    this.props.onFetchCart();
    // this.scrollHandler();
    // console.log(queryString.parse(this.props.location.search), 'from Layout');
    if (queryString.parse(this.props.location.search).auth) {
      this.props.onSetAuthModalToTrue();
    } else {
      // document.querySelector('[href="#"]').click();
    }
  }
  componentWillUnmount() {
    // window.removeEventListener('scroll', this.scrollFunc);
  }
  scrollHandler = () => {
    // window.addEventListener('scroll', this.scrollFunc);
  };
  scrollFunc = e => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.state.lastScrollTop) {
      // downscroll code
      this.setState({
        slideMenu: false
      });
    } else {
      // upscroll code

      this.setState({
        slideMenu: true
      });
    }
    this.setState({
      lastScrollTop: st <= 0 ? 0 : st
    });
  };

  slideInHandler = () => {
    this.setState(prevState => {
      return { shouldSlideIn: !prevState.shouldSlideIn };
    });
  };
  releaseModal = () => {
    this.setState(prevState => {
      return {
        showModal: !prevState.showModal
      };
    });
  };

  render() {
    return (
      <div className={classes.Layout}>
        {/* <a href='#'> </a> */}
        <div
          className=''
          style={{
            position: 'fixed',
            width: '100%',
            zIndex: '100',
            // top: this.state.slideMenu ? 0 : -86,
            transition: '.51s'
          }}
        >
          <MobileNavContainer
            itemCount={this.props.itemCount}
            hideCheckoutDrop={this.props.hideCheckoutDrop}
            isToggled={this.state.shouldSlideIn}
            clicked={this.slideInHandler}
          />
        </div>

        {!this.props.isAuthenticated ? (
          <Modal
            removeModal={this.props.onShowAuthModalToggle}
            show={this.props.showAuthModal}
          >
            <AuthCont clicked={this.props.onShowAuthModalToggle} />
          </Modal>
        ) : null}
        <div className={classes.ModalCont}></div>
        <SideDrawer
          // goToIndividualSeller={this.goToIndividualSeller}
          // goToBusinessSeller={this.goToBusinessSeller}
          shouldslidein={this.state.shouldSlideIn}
          istoggled={this.state.shouldSlideIn}
          clicked={this.slideInHandler}
        />

        <div
          className=''
          style={{
            position: 'fixed',
            width: '100%',
            zIndex: '1000',
            transition: '.51s'
          }}
        >
          <TopNavContainer
            hideCheckoutDrop={this.props.hideCheckoutDrop}
            clickForModal={this.props.onShowAuthModalToggle}
            itemCount={this.props.itemCount}
          />
          {/* <NavContainer /> */}
        </div>

        <div className='' style={{ paddingTop: 50, minHeight: 700 }}>
          {this.props.children}
        </div>
        {this.props.hideFooter ? null : <FooterPage />}
        <div className={classes.CopyRight}>
          © 2019 Geetico. All Rights Reserved.
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onFetchCart: () => dispatch(fetchCart()),
    onShowAuthModalToggle: () => dispatch(toggleAuthModalAction()),
    onSetAuthModalToTrue: () => dispatch(setAuthModalToTrue())
  };
};
const mapStateToProps = state => {
  return {
    itemCount: state.cart.itemCount,
    isAuthenticated: state.auth.token !== null,
    showAuthModal: state.auth.showAuthModal
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
