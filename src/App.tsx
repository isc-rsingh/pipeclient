import React, { useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Titlebar from './components/titlebar/titlebar';
import PipelineEditorContainer from './components/pipelineeditorcontainer/pipelineeditorcontainer';
import AddNewTask from './components/addnewtask/addnewtask';

import { useKeyPress } from './hooks/usekeypress';

function useForceUpdate(){
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

let openAddNewTask = false;

function App(): JSX.Element {
  function addNewTask() {
    openAddNewTask = true;
    forceUpdate();
  }
 
  function closeAddNewTask() {
    openAddNewTask = false;
    forceUpdate();
  }

  useKeyPress([{
    key:'t',shiftKey:false,ctrlKey:false,altKey:true,metaKey:false    
  }],addNewTask)

  const forceUpdate = useForceUpdate();

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
        <AddNewTask open={openAddNewTask} onClose={closeAddNewTask}></AddNewTask>
    </div>
  );
}

export default App;
