import React from "react";
import NavigationItems from "../../components/NavigationItems/NavigationItems";
import classes from "./NavContainer.module.css";

const navContainerArray = [classes.NavContainer, classes.DesktopOnly];

const navContainer = props => (
  <div className={navContainerArray.join(" ")}>
    <NavigationItems
      clicked={() => {
        return null;
      }}
    />
  </div>
);

export default navContainer;
