import {createSlice} from '@reduxjs/toolkit';
import { Pipeline } from '../models/pipeline';
import { Task } from '../models/task';

const pipelineData: Pipeline = {
    "id": "FECA6560-ED26-11EC-8DAF-F4D488652FDC",
    "metadata": {"created":"66202,14742.28642", "modified":"66202,14742.28642","creator":"UnknownUser"},
    "tasks": [
        {
            "taskid": "85D0E4D0-ED27-11EC-8DAE-F4D488652FDC",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal"
            },
            "sink": {
                "type": "iris|table",
                "name": "RSPIPELINE.XYZ",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
        {
            "taskid": "CAF03F60-ED28-11EC-8DAF-F4D488652FDC",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal"
            },
            "sink": {
                "type": "iris|table",
                "name": "RSPIPELINE.XYZLOOKUP",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
        {
            "taskid": "32D44690-ED28-11EC-8DB0-F4D488652FDC",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal",
                "tasks": ["85D0E4D0-ED27-11EC-8DAE-F4D488652FDC"]
            },
            "type": "rs.pipeline.TaskFieldCompute",
            "compute": {
                "template": {
                    "inputsource": {
                        "name": "RSPIPELINE.XYZ",
                        "taskid": "85D0E4D0-ED27-11EC-8DAE-F4D488652FDC"
                    },
                    "targetfield": "totalincome",
                    "fields": ["loan_ID", "gender", "married", "dependents", "education", "self_employed", "applicantincome", "coapplicantincome", "loanAmount", "loan_amount_term", "credit_history", "property_area", "loan_status"]
                },
                "operation": "applicantincome + coapplicantincome"
            },
            "sink": {
                "type": "iris|view",
                "name": "RSPIPELINE.xyztotinc",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
        {
            "taskid": "a206a09f-d6e2-4a4d-8522-aae1c2288397C",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal",
                "tasks": ["85D0E4D0-ED27-11EC-8DAE-F4D488652FDC"]
            },
            "type": "rs.pipeline.TaskFieldCompute",
            "compute": {
                "template": {
                    "inputsource": {
                        "name": "RSPIPELINE.XYZ",
                        "taskid": "85D0E4D0-ED27-11EC-8DAE-F4D488652FDC"
                    },
                    "targetfield": "totalincome",
                    "fields": ["loan_ID", "gender", "married", "dependents", "education", "self_employed", "applicantincome", "coapplicantincome", "loanAmount", "loan_amount_term", "credit_history", "property_area", "loan_status"]
                },
                "operation": "applicantincome + coapplicantincome"
            },
            "sink": {
                "type": "iris|view",
                "name": "RSPIPELINE.xyztotinc",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
        {
            "taskid": "c699117e-3913-4793-80fe-e3a7cabb651f",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal",
                "tasks": ["a206a09f-d6e2-4a4d-8522-aae1c2288397C"]
            },
            "type": "rs.pipeline.TaskFieldCompute",
            "compute": {
                "template": {
                    "inputsource": {
                        "name": "RSPIPELINE.XYZ",
                        "taskid": "85D0E4D0-ED27-11EC-8DAE-F4D488652FDC"
                    },
                    "targetfield": "totalincome",
                    "fields": ["loan_ID", "gender", "married", "dependents", "education", "self_employed", "applicantincome", "coapplicantincome", "loanAmount", "loan_amount_term", "credit_history", "property_area", "loan_status"]
                },
                "operation": "applicantincome + coapplicantincome"
            },
            "sink": {
                "type": "iris|view",
                "name": "RSPIPELINE.xyztotinc",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
        {
            "taskid": "535c026f-2c46-455e-abc2-47ea1aaced1b",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal",
                "tasks": ["c699117e-3913-4793-80fe-e3a7cabb651f"]
            },
            "type": "rs.pipeline.TaskFieldCompute",
            "compute": {
                "template": {
                    "inputsource": {
                        "name": "RSPIPELINE.XYZ",
                        "taskid": "c699117e-3913-4793-80fe-e3a7cabb651f"
                    },
                    "targetfield": "totalincome",
                    "fields": ["loan_ID", "gender", "married", "dependents", "education", "self_employed", "applicantincome", "coapplicantincome", "loanAmount", "loan_amount_term", "credit_history", "property_area", "loan_status"]
                },
                "operation": "applicantincome + coapplicantincome"
            },
            "sink": {
                "type": "iris|view",
                "name": "RSPIPELINE.xyztotinc",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
        {
            "taskid": "9a31e0ea-b243-43cb-a490-82e3c80b8ab9",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal",
                "tasks": ["c699117e-3913-4793-80fe-e3a7cabb651f"]
            },
            "type": "rs.pipeline.TaskFieldCompute",
            "compute": {
                "template": {
                    "inputsource": {
                        "name": "RSPIPELINE.XYZ",
                        "taskid": "c699117e-3913-4793-80fe-e3a7cabb651f"
                    },
                    "targetfield": "totalincome",
                    "fields": ["loan_ID", "gender", "married", "dependents", "education", "self_employed", "applicantincome", "coapplicantincome", "loanAmount", "loan_amount_term", "credit_history", "property_area", "loan_status"]
                },
                "operation": "applicantincome + coapplicantincome"
            },
            "sink": {
                "type": "iris|view",
                "name": "RSPIPELINE.xyztotinc",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
   ]
  };


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
            const targetTask = state.value.tasks?.find(t=>t.taskid === action.payload.target);
            if (targetTask && targetTask.source) {
                targetTask.source.tasks = targetTask.source.tasks || [];
                targetTask.source.tasks.push(action.payload.source);
            }
        },
        disconnectSourceFromTarget: (state, action) => {
            const targetTask = state.value.tasks?.find(t=>t.taskid === action.payload.target);
            if (targetTask && targetTask.source && targetTask.source.tasks) {
                const idx = targetTask.source.tasks.findIndex(x=>x === action.payload.source);
                if (idx>=0) {
                    targetTask.source.tasks.splice(idx,1);
                }
            }
        },
        setTaskPosition: (state, action) => {
            state.value.metadata.position = state.value.metadata.position || {};
            state.value.metadata.position[action.payload.taskid] = {x:action.payload.x, y: action.payload.y};
        },
        setTaskProperty: (state, action) =>{
            const task = state.value.tasks?.find(t=>t.taskid === action.payload.task.taskid);
            
            const pathArray = action.payload.path.split('.').reverse();
            let obj:any=task;
            while (pathArray.length>1) {
                const key = pathArray.pop();
                obj=obj[key];
            }
            obj[pathArray[0]] = action.payload.value;
        },
        setTaskName: (state, action) => {
            const task = state.value.tasks?.find(t=>t.taskid === action.payload.task.taskid);
            task.metadata = task.metadata || {};
            task.metadata.name = action.payload.name;
        },
        updateTaskInputSource: (state, action) => {
            const task = state.value.tasks?.find(t=>t.taskid === action.payload.task.taskid);
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