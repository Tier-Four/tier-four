import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <div className="NavBar" >
        <Link to="/home">
          Home
          </Link>
        <Link to="/dashboard">
          Dashboard
          </Link>
        <Link to="/admin">
          Admin
          </Link>
          <Link to="/test">
          Test
          </Link>
      </div>
    )
  }
}


export default NavBar;