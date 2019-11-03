import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./NavigationItem.module.css";
// import { faCartArrowDown, faSearch } from "@fortawesome/free-solid-svg-icons";

const navigationItem = props => {
  let classType = [classes.NavigationItem].join(" ");
  if (props.ActiveNav && props.isSeller) {
    classType = [classes.NavigationItem, classes.Seller, classes.Active].join(
      " "
    );

    // console.log(classType);
  }
  if (props.isSeller && !props.ActiveNav) {
    classType = [classes.NavigationItem, classes.Seller].join(" ");
  }
  if (props.isBuyer) {
    classType = [classes.NavigationItem, classes.Orange].join(" ");
  }

  switch (props.linkType) {
    case "ReactLink":
      return (
        <li className={classType} onClick={props.clicked}>
          <Link
            // style={{ color: props.isSeller ? "blue" : "orange" }}
            // style={{ paddingRight: "20px" }}
            to={props.to}
          >
            {props.addIcon ? (
              <span className={classes.Font}>
                <FontAwesomeIcon icon={props.icon} />
              </span>
            ) : null}
            {props.children}
          </Link>
        </li>
      );

    default:
      return;
  }
};

export default navigationItem;
