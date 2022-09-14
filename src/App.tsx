import React, { useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Titlebar from './components/titlebar/titlebar';
import PipelineEditorContainer from './components/pipelineeditorcontainer/pipelineeditorcontainer';
import AddNewTask from './components/addnewtask/addnewtask';

import { useKeyPress } from './hooks/usekeypress';
import { Drawer } from '@mui/material';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"

function useForceUpdate(){
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

let openAddNewTask = false;

function App(): JSX.Element {
  
  const [state, setState] = useState({drawerOpen:false});


  function toggleDrawer() {
    setState({drawerOpen:!state.drawerOpen});
  }

  function handleDrawerClose() {
    setState({drawerOpen:false});
  }

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
          <Titlebar toggledrawer={toggleDrawer.bind(this)}></Titlebar>
            <Drawer anchor="left" open={state.drawerOpen} variant="persistent">
              <div className='close-drawer-container'>
                <ChevronLeftIcon onClick={handleDrawerClose} />
              </div>
              <Sidebar></Sidebar>
            </Drawer>
            <PipelineEditorContainer></PipelineEditorContainer>
        </DndProvider>
        <AddNewTask open={openAddNewTask} onClose={closeAddNewTask}></AddNewTask>
    </div>
  );
}

export default App;
