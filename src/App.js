import React, { Component } from 'react';
import './App.css';
import Admin from './Admin';

class App extends Component {
  render() {
    return <Admin apiUrl={process.env.REACT_APP_API_URL} />
  }
}

export default App;
