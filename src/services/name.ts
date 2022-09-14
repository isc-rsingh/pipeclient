import { Task } from "../models/task";
import { ICatalogPipelineResponse, ICatalogTaskResponse } from "./api";

function getTaskName(task:Task | ICatalogTaskResponse): string{
    if (!task) return '';
    if (task && task.metadata && task.metadata.name) {
        return task.metadata.name;
    }
    return task.taskid;
}

export const name = {
    getTaskName
}