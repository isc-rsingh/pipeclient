import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Titlebar from './components/titlebar/titlebar';
import PipelineEditorContainer from './components/pipelineeditorcontainer/pipelineeditorcontainer';

function App(): JSX.Element {
  return (
    <div className="App">
      <div className="stripe"></div>
        <DndProvider backend={HTML5Backend}>
        <Titlebar></Titlebar>
        <section className='main-working-container'>
          <Sidebar></Sidebar>
          <PipelineEditorContainer></PipelineEditorContainer>
        </section>
      </DndProvider>
    </div>
  );
}

export default App;
