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

export const taskHelper = {
    getTasksForRecipe,
    taskIsInError,
    taskIsSuccess,
    taskNotConfigured,
}