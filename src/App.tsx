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
import { useDispatch, useSelector } from 'react-redux';
import { closeAddNewTaskDialog, openAddNewTaskDialog } from './stores/ui-state-store';

function App(): JSX.Element {
  
  const [state, setState] = useState({drawerOpen:false});


  function toggleDrawer() {
    setState({drawerOpen:!state.drawerOpen});
  }

  function handleDrawerClose() {
    setState({drawerOpen:false});
  }

  function addNewTask() {
    dispatch(openAddNewTaskDialog({}));
  }
 
  function closeAddNewTask() {
    dispatch(closeAddNewTaskDialog({}));
  }

  useKeyPress([{
    key:'t',shiftKey:false,ctrlKey:false,altKey:true,metaKey:false    
  }],addNewTask)

  const dispatch = useDispatch();

  const uiState = useSelector((state:any)=>state.uiState.value);
  
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
        <AddNewTask open={uiState.showAddNewTaskDialog} onClose={closeAddNewTask}></AddNewTask>
    </div>
  );
}

export default App;
