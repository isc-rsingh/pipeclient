import { useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Routes, Route, Outlet } from "react-router-dom";

import './App.css';
import Titlebar from './components/titlebar/titlebar';
import PipelineEditorContainer from './components/pipelineeditorcontainer/pipelineeditorcontainer';
import AddNewTask from './components/addnewtask/addnewtask';


import { useKeyPress } from './hooks/usekeypress';
import { useDispatch, useSelector } from 'react-redux';
import { closeAddNewTaskDialog, openAddNewTaskDialog } from './stores/ui-state-store';
import StartupScreen from './components/startupscreen/startupscreen';
import Footer from './components/footer/footer';
import { Alert, Snackbar } from '@mui/material';
import saveNotification from './services/saveNotification';

let snackMsg = 'ABC';

function Layout():JSX.Element {
  const [state, setState] = useState({drawerOpen:false});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  function toggleDrawer() {
    setState({drawerOpen:!state.drawerOpen});
  }

  function addNewTask() {
    dispatch(openAddNewTaskDialog({}));
  }
 
  function closeAddNewTask() {
    dispatch(closeAddNewTaskDialog({}));
  }

  function showNotification(msg) {
    snackMsg = msg;
    setSnackbarOpen(true);
  }

  saveNotification.setNotificationCallback(showNotification.bind(this));

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
          <Outlet />
          <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              {snackMsg}
            </Alert>
          </Snackbar>
        </DndProvider>
        <Footer />
        <AddNewTask open={uiState.showAddNewTaskDialog} onClose={closeAddNewTask}></AddNewTask>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <div className="RouterOutlet">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StartupScreen />} />
          <Route path="/start" element={<StartupScreen />} />
          <Route path="/pipeline/:pipelineid" element={<PipelineEditorContainer />} />
          <Route path="*" element={<StartupScreen />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
