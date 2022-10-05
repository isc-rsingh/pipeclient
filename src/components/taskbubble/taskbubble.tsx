import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Task } from "../../models/task";
import { api, baseURL } from "../../services/api";
import { name } from "../../services/name";
import { taskHelper } from "../../services/taskHelper";
import { setTaskBeingEdited } from "../../stores/ui-state-store";
import TaskTypeIcon from "../tasktypeicon/tasktypeicon";

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

    const dispatch = useDispatch();

    const inError = taskHelper.taskIsInError(props.task);
    const isSuccess = taskHelper.taskIsSuccess(props.task);
    const isNotConfigured = taskHelper.taskNotConfigured(props.task);
    
    const selectedTask:Task = useSelector((state:any)=>state.uiState.value.taskBeingEditted);

    const isSelected = selectedTask?.taskid === props.task.taskid;

    function setSelectedTask() {
        dispatch(setTaskBeingEdited(props.task));
    }
    
    return (<div className={`task-bubble-container ${isSelected && 'task-bubble-selected'} ${!isSelected && 'task-bubble-not-selected'} ${inError && 'task-bubble-error'} ${isSuccess && 'task-bubble-success'} ${isNotConfigured && 'task-bubble-not-configured'}`} onClick={setSelectedTask}>
        {isSelected && <div className="task-bubble-status"></div>}
        {taskType && <TaskTypeIcon taskType={taskType.type} className='task-type-icon' />}
        <span className="task-bubble-task-name">{name.getTaskName(props.task)}</span>
        {!isSelected && <div className="task-bubble-status"></div>}
    </div>);
}