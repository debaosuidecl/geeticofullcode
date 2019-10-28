import React, { Component } from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';
import { Dropdown } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import App from '../../App';
class NavigationItems extends Component {
  state = {
    categories: [
      'Beer, Wine & Spirit',
      'Food Cupboard',
      'Beverages',
      'Drinks',
      'Cooking & Baking',
      'Breakfast Foods'
      // 'Food Cupboard'
    ]
  };
  render() {
    const { categories } = this.state;
    const renderCategoryArray = categories.map((category, i) => (
      <NavigationItem
        isBuyer
        key={i}
        clicked={() => {
          this.props.clicked(category);
        }}
        linkType='ReactLink'
        to={`/category/${category}`}
      >
        {category}
      </NavigationItem>
    ));
    return (
      <ul className={classes.NavigationItems}>
        <Dropdown text='All Categories' color='white'>
          <Dropdown.Menu>
            {App.allowedCategories.map(category => (
              <Dropdown.Item
                key={category}
                //  icon='folder'
                text={category}
                onClick={() => {
                  // this.props.onLogout();
                  this.props.history.push(`/category/${category}`);
                }}
                // description='track your orders'
              />
            ))}

            <Dropdown.Divider />
          </Dropdown.Menu>
        </Dropdown>
        {renderCategoryArray}
      </ul>
    );
  }
}

export default withRouter(NavigationItems);
