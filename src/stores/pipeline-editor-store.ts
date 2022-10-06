import {createSlice} from '@reduxjs/toolkit';
import { Pipeline } from '../models/pipeline';
import { Task } from '../models/task';

const pipelineData: Pipeline | null = null;


  export const pipelineEditorSlice = createSlice({
    name:'pipelineeditor',
    initialState:{value:pipelineData},
    reducers:{
        setPipeline: (state,action) => {
            state.value=action.payload;
        },
        addTask: (state,action) => {
            const t:Task = action.payload;
            
            if (!state.value.tasks) {
                state.value.tasks = [];
            }

            if (!state.value.taskCopies) {
                state.value.taskCopies = [];
            }

            state.value.taskCopies.push(t);
            state.value.tasks.push(t.taskid)
        },
        addExistingTask: (state, action) => {
            if (!state.value.tasks) {
                state.value.tasks = [];
            }
            
            const task = {...action.payload};
            
            task.pipelineids = task.pipelineids || [];
            task.pipelineids.push(state.value.pipelineid);

            state.value.taskCopies.push(task);
            state.value.tasks.push(task.taskid);
        },
        removeTaskFromPipeline: (state, action) => {
            const taskId:string = action.payload;
            const task:Task = state.value.taskCopies.find(x=>x.taskid===taskId);

            //remove from pipeline tasks
            let idx = state.value.tasks.indexOf(taskId);
            state.value.tasks.splice(idx,1);

            //remove from pipeline task copies
            idx = state.value.taskCopies.findIndex(x=>x.taskid===taskId);
            state.value.taskCopies.splice(idx,1);

            //remove pipeline from task
            idx = task.pipelineids.indexOf(state.value.pipelineid);
            task.pipelineids.splice(idx,1);

        },
        connectSourceToTarget: (state, action) => {
            const targetTask:Task = state.value.taskCopies.find(x=>x.taskid===action.payload.target);
            
            targetTask.source.tasks = targetTask.source.tasks || [];
            targetTask.source.tasks.push(action.payload.source);
        },
        disconnectSourceFromTarget: (state, action) => {
        },
        setTaskPosition: (state, action) => {
            state.value.metadata.position = state.value.metadata.position || {};
            state.value.metadata.position[action.payload.taskid] = {x:action.payload.x, y: action.payload.y};
        },
        setTaskProperty: (state, action) =>{
            state.value.taskCopies.map((task:Task)=>{
                if (task.taskid !== action.payload.task.taskid) {
                    return task;
                }
                const pathArray = action.payload.path.split('.').reverse();
                let obj:any=task;
                while (pathArray.length>1) {
                    const key = pathArray.pop();
                    obj=obj[key];
                }
                obj[pathArray[0]] = action.payload.value;
                return task;
            });
        },
        setTaskName: (state, action) => {
            const task = state.value.taskCopies?.find(t=>t.taskid === action.payload.task.taskid);
            task.metadata = task.metadata || {};
            task.metadata.name = action.payload.name;
        },
        updateTaskInputSource: (state, action) => {
            const task = state.value.taskCopies?.find(t=>t.taskid === action.payload.task.taskid);
            task.source.tasks = [action.payload.sourceTask];
        },
        addTaskToRecipe: (state, action) => {
            const recipeTask:Task = state.value.taskCopies.find(t=>t.taskid === action.payload.recipetaskid);
            recipeTask.source.tasks = recipeTask.source.tasks || [];
            recipeTask.source.tasks.push(action.payload.taskid);
        },
        removeTaskFromRecipe: (state, action) => {
            const recipeTask:Task = state.value.taskCopies.find(t=>t.taskid === action.payload.recipetaskid);
            const removeIdx = recipeTask.source.tasks.indexOf(action.payload.taskid);
            if (removeIdx > -1) {
                recipeTask.source.tasks.splice(removeIdx,1);
            }
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
    removeTaskFromPipeline,
    addTaskToRecipe,
    removeTaskFromRecipe,
  } = pipelineEditorSlice.actions;

  export default pipelineEditorSlice.reducer;