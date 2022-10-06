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
    },
    "rs.pipeline.TaskSQLSelect": {
        "sql":""
    }
};

export const TaskTypes = {
    TaskDropColumns: 'rs.pipeline.TaskDropColumns',
    TaskFieldComplete: 'rs.pipeline.TaskFieldCompute',
    TaskFilter: 'rs.pipeline.TaskFilter',
    TaskGroupBy: 'rs.pipeline.TaskGroupBy',
    TaskJoin: 'rs.pipeline.TaskJoin',
    TaskSQLSelect: 'rs.pipeline.TaskSQLSelect',
    TaskPersistent: 'rs.pipeline.TaskPersistent',
    TaskRecipe:"rs.pipeline.TaskRecipe",
}

export async function createTemplate(taskSkeleton:Task, pipelineId:string) {
    const task = {
        ...taskSkeleton,
        compute: {
            template:computeMap[taskSkeleton.type] || {}
        }
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