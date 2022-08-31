import { Task } from "../models/task";

const computeMap = {
    "rs.pipeline.TaskFieldCompute": {
        targetfield:"",
        operation:"",
        outfields:[],
    },
    "rs.pipeline.TaskGroupBy": {
        groupfields:[],
        aggregationfields:[],
    },
    "rs.pipeline.TaskJoin": {
        source:{},
        reference:{}
    }
};

export async function createTemplate(taskSkeleton:Task, pipelineId:string) {
    const task = {
        ...taskSkeleton,
        compute:computeMap[taskSkeleton.type] || {}
    }
    task.pipelineids = task.pipelineids || [];
    task.pipelineids.push(pipelineId);
    
    return Promise.resolve(task);
}