import React from "react";
import classes from "./Layout.module.css";
import NavContainer from "../../../containers/NavContainer/NavContainer";
import TopNavContainer from "../../../containers/TopNavContainer/TopNavContainer";
import MobileNavContainer from "../../../containers/MobileNavContainer/MobileNavContainer";
import SideDrawer from "../../SideDrawer/SideDrawer";
import Modal from "../Modal/Modal";
// import Backdrop from "../Backdrop/Backdrop";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBusinessTime, faUserAlt } from "@fortawesome/free-solid-svg-icons";

class Layout extends React.Component {
  state = {
    shouldSlideIn: false,
    showModal: false
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
  goToBusinessSeller = () => {
    this.props.history.push("/sellerregister/businessseller");
  };
  goToIndividualSeller = () => {
    this.props.history.push("/sellerregister/individualseller");
  };
  render() {
    return (
      <div className={classes.Layout}>
        <MobileNavContainer
          isToggled={this.state.shouldSlideIn}
          clicked={this.slideInHandler}
        />
        {/* <div>
          <Backdrop show={this.state.shouldSlideIn} />
        </div> */}
        <div className={classes.ModalCont}>
          <Modal removeModal={this.releaseModal} show={this.state.showModal}>
            <div className={classes.ModalContent}>
              <h2 className={classes.ModalHeader}>Seller Registration</h2>
              <h5>
                <div
                  className={classes.SVGcont}
                  onClick={this.goToBusinessSeller}
                >
                  <FontAwesomeIcon
                    color="orange"
                    icon={faBusinessTime}
                    size="4x"
                  />
                </div>
                <p>Become a Business Seller</p>
              </h5>
              <h5>
                <div
                  className={classes.SVGcont}
                  onClick={this.goToIndividualSeller}
                >
                  <FontAwesomeIcon color="orange" icon={faUserAlt} size="4x" />
                </div>
                <p>Become an Individual Seller</p>
              </h5>
            </div>
          </Modal>
        </div>
        <SideDrawer
          goToIndividualSeller={this.goToIndividualSeller}
          goToBusinessSeller={this.goToBusinessSeller}
          shouldSlideIn={this.state.shouldSlideIn}
        />
        <TopNavContainer clickForModal={this.releaseModal} />
        <NavContainer />
        {this.props.children}
        <div style={{ background: "#333", height: "120px", width: "100%" }} />
      </div>
    );
  }
}

export default withRouter(Layout);
