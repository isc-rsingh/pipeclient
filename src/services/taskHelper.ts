import { pipeline } from "stream";
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

const taskIsRunning = (task:Task, runningTasks:string[]): boolean => {
    return (!!task?.metadata?.running || runningTasks.includes(task.taskid));
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

const getStatisticsForColumn = (pipeline:Pipeline, taskid: string, colname:string) => {
    const task:Task = pipeline.taskCopies.find(tc=>tc.taskid === taskid);
    if (task?.metadata?.statistics) {
        const colStats = task.metadata.statistics.find(s=>s.property === colname);
        return colStats;
    }

    return null;
}

export const taskHelper = {
    getTasksForRecipe,
    getFieldsForTask,
    taskIsInError,
    taskIsSuccess,
    taskNotConfigured,
    taskIsRunning,
    getStatisticsForColumn,
}