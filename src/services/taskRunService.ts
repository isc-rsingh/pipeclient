import { api } from './api';

let taskMonitorHandle;
let tasksBeingMonitored:string[] = [];

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
        taskMonitorHandle = setTimeout(monitorTasks,3000);
    }
}

async function monitorTasks() {
    const taskList = [...tasksBeingMonitored]
    for (let i=taskList.length - 1;i>=0;i--) {
        let task = await api.getTask(taskList[i]);
        if (!(task.metadata?.running)) {
            tasksBeingMonitored.splice(i,1);
        }
    }

    if (tasksBeingMonitored.length) {
        taskMonitorHandle=setTimeout(monitorTasks,3000);
    } else {
        taskMonitorHandle=null;
    }
}

export default {
    runTask,
    runTestTask,
    setupTaskMonitoring,
}

