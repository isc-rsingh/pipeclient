import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit'
import pipelineEditorReducer from './stores/pipeline-editor-store';
import { debounce } from './services/debounce';
import { api } from './services/api';
import { Pipeline } from './models/pipeline';
const store = configureStore({
  reducer:{
    pipelineEditor:pipelineEditorReducer
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

let lastPipelineState;
let debouncedSave = debounce((pipeline:Pipeline)=>{
  api.savePipeline(pipeline);
},1000);
store.subscribe(()=>{
  const currentPipelineState = store.getState().pipelineEditor.value;
  if (JSON.stringify(lastPipelineState) !== JSON.stringify(currentPipelineState)) {
    console.log('old',lastPipelineState,'current',currentPipelineState);
    lastPipelineState = currentPipelineState;

    if (currentPipelineState.id !== 'FECA6560-ED26-11EC-8DAF-F4D488652FDC') {
      debouncedSave(currentPipelineState);
    }
  }
});

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
