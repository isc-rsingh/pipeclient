import axios from 'axios';
import {user} from './user';

export const baseURL = 'http://3.81.189.215:52773';
export const baseApiURL = `${baseURL}/vnx`;

export default axios.create({
    baseURL,
});

let taskTypeCache:any[]=[];

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

export const api = {
    getAllTaskTypes,
    createEmptyPipeline,
    createEmptyTask,
};