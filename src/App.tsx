import React from 'react';

import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Titlebar from './components/titlebar/titlebar';

function App(): JSX.Element {
  return (
    <div className="App">
      <div className="stripe"></div>
      <Titlebar></Titlebar>
      <Sidebar></Sidebar>
    </div>
  );
}

export default App;
