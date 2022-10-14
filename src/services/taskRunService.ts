import { AnyAction, EnhancedStore } from '@reduxjs/toolkit';
import { Pipeline } from '../models/pipeline';
import { IUiState, setTaskNotRunning, setTaskRunning } from '../stores/ui-state-store';
import { api } from './api';

let taskMonitorHandle;
let tasksBeingMonitored:string[] = [];

let reduxStore;

const registerReduxStore = (store) => {

    reduxStore = store;
}

const runTask = (taskid:string) => {
    setupTaskMonitoring(taskid);
    return api.runTask(taskid);
}

const runTestTask = (taskid:string) => {
    setupTaskMonitoring(taskid);
    return api.runTestTask(taskid);
}

const setupTaskMonitoring = (taskid) => {
    if (!tasksBeingMonitored.includes(taskid)) {
        tasksBeingMonitored.push(taskid);
    }

    if (!taskMonitorHandle) {
        taskMonitorHandle = setTimeout(monitorTasks,1000);
    }

    reduxStore.dispatch(setTaskRunning({taskid}));
}

async function monitorTasks() {
    const taskList = [...tasksBeingMonitored]
    for (let i=taskList.length - 1;i>=0;i--) {
        let task = await api.getTask(taskList[i]);
        if (!(task.metadata?.running)) {
            tasksBeingMonitored.splice(i,1);
            reduxStore.dispatch(setTaskNotRunning({taskid:task.taskid}));
        }
    }

    if (tasksBeingMonitored.length) {
        taskMonitorHandle=setTimeout(monitorTasks,1000);
    } else {
        taskMonitorHandle=null;
    }
}

export default {
    runTask,
    runTestTask,
    setupTaskMonitoring,
    registerReduxStore,
}

