import { useEffect, useState } from "react";
import { Task } from "../../models/task";
import { api, baseURL } from "../../services/api";
import { name } from "../../services/name";
import { taskHelper } from "../../services/taskHelper";

import "./taskbubble.css";

export interface TaskBubbleProps {
    task:Task
}

export default function TaskBubble(props:TaskBubbleProps):JSX.Element {
    const [taskType, setTaskType] = useState(null);
    
    useEffect(()=>{
        api.getAllTaskTypes().then((tt)=>{
            const t = tt.find(x=>x.type === props.task.type);
            if (t) {
                setTaskType(t);
            }
        });
    });

    const inError = taskHelper.taskIsInError(props.task);
    const isSuccess = taskHelper.taskIsSuccess(props.task);
    const isNotConfigured = taskHelper.taskNotConfigured(props.task);
    
    return (<div className={`task-bubble-container ${inError && 'task-bubble-error'} ${isSuccess && 'task-bubble-success'} ${isNotConfigured && 'task-bubble-not-configured'}`}>
        {taskType && <img src={baseURL + taskType.icon} className='task-type-icon' alt={taskType.description}></img>}
        <span className="task-bubble-task-name">{name.getTaskName(props.task)}</span>
        <div className="task-bubble-status"></div>
    </div>);
}