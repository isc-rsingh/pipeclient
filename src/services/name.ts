import { Task } from "../models/task";
import { ICatalogTaskResponse } from "./api";

function getTaskName(task:Task | ICatalogTaskResponse): string{
    if (!task) return '';
    
    // if (task.taskid.length !== 36) {
    //     return task.taskid;
    // }

    if (task && task.metadata && task.metadata.name) {
        return task.metadata.name;
    }
    
    return task.taskid;
}

export const name = {
    getTaskName
}