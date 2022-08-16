import React from 'react';

import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Titlebar from './components/titlebar/titlebar';
import PipelineEditor from './components/pipelineeditor/pipelineeditor';

function App(): JSX.Element {
  return (
    <div className="App">
      <div className="stripe"></div>
      <Titlebar></Titlebar>
      <section className='main-working-container'>
        <Sidebar></Sidebar>
        <PipelineEditor></PipelineEditor>
      </section>
    </div>
  );
}

export default App;
