import { Task } from "../models/task";

function getTaskName(task:Task): string{
    if (!task) return '';
    if (task && task.metadata && task.metadata.name) {
        return task.metadata.name;
    }
    return task.taskid;
}

export const name = {
    getTaskName
}