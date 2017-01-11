import React, { Component } from 'react';
import Admin from './components/Admin';

class App extends Component {
  render() {
    return <Admin apiUrl={process.env.REACT_APP_API_URL} />
  }
}

export default App;
