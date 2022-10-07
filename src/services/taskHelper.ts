import { Pipeline } from "../models/pipeline"
import { Task } from "../models/task"
import { TaskTypes } from "./taskTypeHelper";

const getTasksForRecipe = (recipeTask:Task, pipeline:Pipeline):Task[] => {
    const rslt:Task[] = [];
    if (recipeTask.source.tasks) {
        recipeTask.source.tasks.forEach(tid=>{
            const sourceTask = pipeline.taskCopies.find(x=>x.taskid===tid);
            if (sourceTask && sourceTask.type !== TaskTypes.TaskRecipe) {
                rslt.push(sourceTask);
            }
        });
    }
    return rslt;
}

const taskIsInError = (task:Task):boolean => {
    return (!task?.metadata?.clean || false);
}

const taskIsSuccess = (task:Task):boolean => {
    return (!!task?.metadata?.clean || false);
}

const taskNotConfigured = (task:Task):boolean => {
    return false; //TODO - plug in logic for this
}

const taskIsRunning = (task:Task): boolean => {
    return (!!task?.metadata?.running || false);
}

const getFieldsForTask = (pipeline:Pipeline, taskid: string ) => {
    if (!pipeline?.taskCopies) {
        return [];
    }

    const task:Task = pipeline.taskCopies.find(t=>t.taskid === taskid);
    if (!task?.metadata?.properties) {
        return [];
    }

    return task.metadata.properties;
}

export const taskHelper = {
    getTasksForRecipe,
    getFieldsForTask,
    taskIsInError,
    taskIsSuccess,
    taskNotConfigured,
    taskIsRunning,
}