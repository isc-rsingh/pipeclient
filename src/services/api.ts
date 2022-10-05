import axios from 'axios';
import { Pipeline } from '../models/pipeline';
import { Task } from '../models/task';
import {user} from './user';
import cloneDeep from 'lodash/cloneDeep';
import { pipeline } from 'stream';
import { TaskTypes } from './taskTypeHelper';
import { ITaskType } from '../models/tasktype';

export const baseURL = 'http://3.88.4.11:52773';
export const baseApiURL = `${baseURL}/vnx`;

export default axios.create({
    baseURL,
});

export interface ICatalogPipelineResponse {
    clean:number,
    creator: string,
    created: Date,
    publish: boolean | number,
    pipelineid: string,
    name?:string,
}

export interface ICatalogMetadataResponse {
    creator:string,
    modified:Date,
    created:Date,
    clean:number,
    runs:number,
    publish:number,
    name:string,
}

export interface ICatalogTaskResponse {
    taskid:string,
        pipelineids:[string],
        type:string,
        metadata:ICatalogMetadataResponse
}

export interface CatalogResponse {
    pipelines:ICatalogPipelineResponse[];
    tasks:ICatalogTaskResponse[];
}

let taskTypeCache:any[]=[];
let catalogCache:CatalogResponse={
    pipelines:[],
    tasks:[]
};

function examineResponse(response:any) {
    if (response.data) {
        return response.data;
    }
    
    return response;
}

function examineError(error:any) {
    console.error(error);
    if (error.data) {
        return error.data;
    }
    return error;
}

const getAllTaskTypes = ():Promise<ITaskType[]> => {
    if (taskTypeCache.length) {
        return Promise.resolve(taskTypeCache);
    }
    return axios.get(`${baseApiURL}/tasktypes`)
    .then(examineResponse)
    .then((response:any[])=>{
        taskTypeCache = response;
        return response;
    })
    .catch(examineError);
}

const getCatalog = ():Promise<CatalogResponse> => {
    if (catalogCache.tasks.length) {
        return Promise.resolve(catalogCache);
    }

    return axios.get(`${baseURL}/cat/all`)
    .then(examineResponse)
    .then((response:CatalogResponse)=> {
        catalogCache = response;
        return catalogCache;
    })
    .catch(examineError);
}

const getTask = (taskId:string):Promise<Task> => {
    return axios.get(`${baseApiURL}/task/${taskId}`)
    .then(examineResponse)
    .catch(examineError);
}

const getPipeline = async (pipelineId:string) => {
    let rslt:Pipeline = await axios.get(`${baseApiURL}/pipeline/${pipelineId}`)
    .then(examineResponse)
    .catch(examineError);

    rslt.taskCopies = [];
    let taskFetches = [];
    if (rslt.tasks?.length) {
        rslt.tasks.forEach(t=>{
            taskFetches.push(getTask(t));
        });

        let allTasks = await Promise.all(taskFetches) as Task[];
        rslt.taskCopies = allTasks;

        taskFetches = [];
        rslt.taskCopies.forEach((tc:Task)=>{
            if (tc.source.tasks) {
                tc.source.tasks.forEach(tid=>{
                    if (!rslt.tasks.includes(tid)) {
                        taskFetches.push(getTask(tid));
                        rslt.tasks.push(tid);
                    }
                })
            }
        });

        if (taskFetches.length) {
            allTasks = await Promise.all(taskFetches) as Task[];
            rslt.taskCopies = rslt.taskCopies.concat(allTasks);
        }
    }

    return rslt;
}

const createRecipeForTask = async(pipelineId:string, taskId:string, name:string) => {
    const recipeTask = await createEmptyTask(TaskTypes.TaskRecipe, pipelineId, name + ' recipe');

    recipeTask.source.tasks = recipeTask.source.tasks || [];
    recipeTask.source.tasks.push(taskId);
    
    return await saveTask(recipeTask);
}

const createEmptyPipeline = (name:string) => {
    return axios.post(`${baseApiURL}/pipeline`,{
        metadata: {
            clean:1,
            creator:user.getCurrentUser(),
            created:new Date(),
            publish:false,
            name,
        },
        taskids:[],
    })
    .then(examineResponse)
    .catch(examineError);
}

const createEmptyTask = async (taskType:string, pipelineid:string, taskName:string):Promise<Task> => {
    const newTask = await axios.post(`${baseApiURL}/task`,{
        type: taskType
    })
    .then(examineResponse)
    .then(t=>{
        t.metadata.name = taskName;
        return t;
    })
    .catch(examineError);
    
    newTask.metadata.name = taskName;
    newTask.pipelineids.push(pipelineid);    
    const rslt = await saveTask(newTask);

    return rslt;
}

const savePipeline = (pipelineData:Pipeline) => {
    const pipelineCopy:Pipeline = cloneDeep(pipelineData);
    if (pipelineCopy.tasks) {
        delete pipelineCopy.tasks;
        delete pipelineCopy.taskCopies;
    }
    return axios.put(`${baseApiURL}/pipeline/${pipelineData.id || pipelineData.pipelineid}`, pipelineCopy)
    .then(examineResponse)
    .catch(examineError);
}

const getDataPreview = (taskId:string) => {
    return axios.get(`${baseApiURL}/task/${taskId}/sample`)
    .then(examineResponse)
    .catch(examineError);
}

const saveTask = async (task:Task):Promise<Task> => {
    if (!task || !task.taskid) throw "No task!";
    const rslt = await axios.put(`${baseApiURL}/task/${task.taskid}`, task)
    .then(examineResponse)
    .catch(examineError);

    return rslt;
}

const runPipeline = (pipelineid:string) => {
    return axios.get(`${baseApiURL}/pipeline/${pipelineid}/run`)
    .then(examineResponse)
    .catch(examineError);
}

const runTask = (taskid:string) => {
    return axios.get(`${baseApiURL}/task/${taskid}/run`)
    .then(examineResponse)
    .catch(examineError);
}

export const api = {
    getAllTaskTypes,
    getCatalog,
    getTask,
    createEmptyPipeline,
    createEmptyTask,
    savePipeline,
    saveTask,
    runPipeline,
    runTask,
    getPipeline,
    createRecipeForTask,
    getDataPreview,
};