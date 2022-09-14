import axios from 'axios';
import { Pipeline } from '../models/pipeline';
import { Task } from '../models/task';
import {user} from './user';

export const baseURL = 'http://3.81.189.215:52773';
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

const getAllTaskTypes = () => {
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

const createEmptyPipeline = () => {
    return axios.post(`${baseApiURL}/pipeline`,{
        metadata: {
            clean:1,
            creator:user.getCurrentUser(),
            created:new Date(),
            publish:false,
        },
        taskids:[]
    })
    .then(examineResponse)
    .catch(examineError);
}

const createEmptyTask = (taskType:string) => {
    return axios.post(`${baseApiURL}/task`,{
        type: taskType
    })
    .then(examineResponse)
    .catch(examineError);
}

const savePipeline = (pipelineData:Pipeline) => {
    return axios.put(`${baseApiURL}/pipeline/${pipelineData.id}`, pipelineData)
    .then(examineResponse)
    .catch(examineError);
}

const saveTask = (task:Task) => {
    return axios.put(`${baseApiURL}/task/${task.taskid}`, task)
    .then(examineResponse)
    .catch(examineError);
}

const runPipeline = (pipelineid:string) => {
    return axios.get(`${baseApiURL}/pipeline/${pipelineid}/run`)
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
};