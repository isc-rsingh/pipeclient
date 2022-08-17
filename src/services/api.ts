import axios from 'axios';
import {user} from './user';

export const baseURL = 'http://3.81.189.215:52773';
export const baseApiURL = `${baseURL}/vnx`;

export default axios.create({
    baseURL,
});

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
    return axios.get(`${baseApiURL}/tasktypes`)
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
    .then(examineError);
}

export const api = {
    getAllTaskTypes,
    createEmptyPipeline
};