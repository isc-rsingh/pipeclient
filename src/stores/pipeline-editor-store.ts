import {createSlice} from '@reduxjs/toolkit';
import { Pipeline } from '../models/pipeline';

const pipelineData: Pipeline | null = null;


  export const pipelineEditorSlice = createSlice({
    name:'pipelineeditor',
    initialState:{value:pipelineData},
    reducers:{
        setPipeline: (state,action) => {
            state.value=action.payload;
        },
        addTask: (state,action) => {
            if (!state.value.tasks) {
                state.value.tasks = [];
            }

            state.value.tasks.push(action.payload);
        },
        addExistingTask: (state, action) => {
            if (!state.value.tasks) {
                state.value.tasks = [];
            }
            
            const task = {...action.payload};
            
            task.pipelineids = task.pipelineids || [];
            task.pipelineids.push(state.value.id);

            state.value.tasks.push(task);
        },
        connectSourceToTarget: (state, action) => {
        },
        disconnectSourceFromTarget: (state, action) => {
        },
        setTaskPosition: (state, action) => {
            state.value.metadata.position = state.value.metadata.position || {};
            state.value.metadata.position[action.payload.taskid] = {x:action.payload.x, y: action.payload.y};
        },
        setTaskProperty: (state, action) =>{
            const task = state.value.tasks?.find(t=>t === action.payload.task.taskid);
            
            const pathArray = action.payload.path.split('.').reverse();
            let obj:any=task;
            while (pathArray.length>1) {
                const key = pathArray.pop();
                obj=obj[key];
            }
            obj[pathArray[0]] = action.payload.value;
        },
        setTaskName: (state, action) => {
            const task = state.value.taskCopies?.find(t=>t.taskid === action.payload.task.taskid);
            task.metadata = task.metadata || {};
            task.metadata.name = action.payload.name;
        },
        updateTaskInputSource: (state, action) => {
            const task = state.value.taskCopies?.find(t=>t.taskid === action.payload.task.taskid);
            task.source.tasks = [action.payload.sourceTask];
        }
    }
  });

  export const { 
    setPipeline, 
    addTask,
    addExistingTask,
    connectSourceToTarget,
    setTaskPosition,
    disconnectSourceFromTarget,
    setTaskProperty,
    setTaskName,
    updateTaskInputSource,
  } = pipelineEditorSlice.actions;

  export default pipelineEditorSlice.reducer;