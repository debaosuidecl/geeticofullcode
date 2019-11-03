import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Error404.css';
class Error404 extends Component {
  componentDidMount() {
    let token = localStorage.getItem('token');
    // console.log(token, 'token');
    if (!token) this.props.history.push('/');
  }
  render() {
    return (
      <div id='notfound'>
        <div className='notfound'>
          <div className='notfound-404'>
            <h1>Oops!</h1>
            <h2>404 - The Page can't be found</h2>
          </div>
          <a href='/'>Go TO Homepage</a>
        </div>
      </div>
    );
  }
}

export default withRouter(Error404);
