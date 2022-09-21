import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit'
import pipelineEditorReducer from './stores/pipeline-editor-store';
import uiStateReducer from './stores/ui-state-store';
import { BrowserRouter } from "react-router-dom";
import { debounce } from './services/debounce';
import { api } from './services/api';
import { Pipeline } from './models/pipeline';
import { Task } from './models/task';

const store = configureStore({
  reducer:{
    pipelineEditor:pipelineEditorReducer,
    uiState: uiStateReducer
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

let lastPipelineState:Pipeline;
let debouncedSave = debounce((pipeline:Pipeline)=>{
  api.savePipeline(pipeline);
},1000);

let debounceSaveTaskById = {};

store.subscribe(()=>{
  const currentPipelineState = store.getState().pipelineEditor.value;
  let updateLast = false || lastPipelineState === undefined;
  if (JSON.stringify(lastPipelineState) !== JSON.stringify(currentPipelineState)) {
    updateLast = true;
    
    if (currentPipelineState.id !== 'FECA6560-ED26-11EC-8DAF-F4D488652FDC') {
      debouncedSave(currentPipelineState);
    }
  }

  if (currentPipelineState && lastPipelineState) {
    currentPipelineState.tasks.forEach((ct:Task)=>{
      const lt = lastPipelineState.tasks.find((t:Task)=>t.taskid == ct.taskid);
      
      debounceSaveTaskById[ct.taskid] = debounceSaveTaskById[ct.taskid] || debounce((task:Task)=>{
        if (currentPipelineState.id !== 'FECA6560-ED26-11EC-8DAF-F4D488652FDC') {
          api.saveTask(ct);
        }
      },2000);

      if (lt && JSON.stringify(lt) !== JSON.stringify(ct)) { //Task was modified
        debounceSaveTaskById[ct.taskid](ct);
        updateLast = true;
        console.log('Task ', ct.taskid, 'saving because change');
      }

      if (!lt) { //Wasn't there before
        debounceSaveTaskById[ct.taskid](ct);
        updateLast = true;
        console.log('Task ', ct.taskid, 'saving because add');
      }
    });
  }
  
  if (updateLast) {
    lastPipelineState = JSON.parse(JSON.stringify(currentPipelineState));
  }
});

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
