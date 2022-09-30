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

export const TaskTypes = {
    TaskRecipe:"rs.pipeline.TaskRecipe",
}

export async function createTemplate(taskSkeleton:Task, pipelineId:string) {
    const task = {
        ...taskSkeleton,
        compute:computeMap[taskSkeleton.type] || {}
    }
    task.pipelineids = task.pipelineids || [];
    task.pipelineids.push(pipelineId);
    
    return Promise.resolve(task);
}

export function getTaskInputCount(task: Task):number {

    switch (task.type) {
        case 'rs.pipeline.TaskJoin':
            return 2;
        case 'rs.pipeline.TaskSQLSelect':
        case 'rs.pipeline.TaskPersistent':
            return 0;
    }

    return 1;
}