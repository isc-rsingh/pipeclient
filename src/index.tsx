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
import taskRunService from './services/taskRunService';

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
  
  if (JSON.stringify(lastPipelineState?.metadata) !== JSON.stringify(currentPipelineState?.metadata)) {
    updateLast = true;
    
    if (currentPipelineState.id !== 'FECA6560-ED26-11EC-8DAF-F4D488652FDC') {
      debouncedSave(currentPipelineState);
    }
  }

  if (currentPipelineState && lastPipelineState) {
    currentPipelineState.taskCopies.forEach((ct:Task)=>{
      const lt = lastPipelineState.taskCopies.find((t:Task)=>t.taskid === ct.taskid);
      
      debounceSaveTaskById[ct.taskid] = debounceSaveTaskById[ct.taskid] || debounce(async (task:Task)=>{
        if (currentPipelineState.id !== 'FECA6560-ED26-11EC-8DAF-F4D488652FDC') {
          const updatedTask = await api.saveTask(task);
          let rslt = await api.validateTask(task.taskid);
          console.log(rslt);
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

    lastPipelineState.taskCopies.forEach((lt:Task)=>{
      debounceSaveTaskById[lt.taskid] = debounceSaveTaskById[lt.taskid] || debounce((task:Task)=>{
        if (currentPipelineState.id !== 'FECA6560-ED26-11EC-8DAF-F4D488652FDC') {
          api.saveTask(task);
        }
      },2000);

      const ct = currentPipelineState.taskCopies.find((t:Task)=>t.taskid === lt.taskid);
      if (!ct) { //Was deleted
        const idx = lt.pipelineids.indexOf(currentPipelineState.pipelineid);
        lt.pipelineids.splice(idx,1);
        debounceSaveTaskById[lt.taskid](lt);
        updateLast = true;
      }
    });
  }
  
  if (updateLast) {
    lastPipelineState = JSON.parse(JSON.stringify(currentPipelineState));
  }

});

taskRunService.registerReduxStore(store);

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
