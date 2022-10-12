import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Task } from "../../models/task";
import { api } from "../../services/api";
import { name } from "../../services/name";
import { taskHelper } from "../../services/taskHelper";
import { setTaskIdBeingEdited } from "../../stores/ui-state-store";
import TaskTypeIcon from "../tasktypeicon/tasktypeicon";
import { ReactComponent as TestRunIcon } from "../../assets/icons/type_test_run.svg";
import { ReactComponent as RunningIcon } from "../../assets/icons/type_running.svg";

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
    const isRunning = taskHelper.taskIsRunning(props.task);
    
    const taskIdBeingEditted:string = useSelector((state:any)=>state.uiState.value.taskIdBeingEditted);

    const isSelected = taskIdBeingEditted === props.task.taskid;

    function setEdittedTask() {
        if (isSelected) {
            dispatch(setTaskIdBeingEdited(null));    
        } else {
            dispatch(setTaskIdBeingEdited(props.task.taskid));
        }
    }

    function testRunTask() {
        api.runTestTask(props.task.taskid);
    }
    
    return (
    <div className="task-bubble">
        {isSelected && <div className="task-bubble-container-selected-top-edge">
            <div className="task-bubble-container-selected-top-edge-intersection" />
        </div>}
        <div className={`task-bubble-container ${isSelected && 'task-bubble-selected'} ${!isSelected && 'task-bubble-not-selected'} ${inError && 'task-bubble-error'} ${isSuccess && 'task-bubble-success'} ${isNotConfigured && 'task-bubble-not-configured'}`} onClick={setEdittedTask}>
            {isSelected && <div className="task-bubble-status"></div>}
            {taskType && <TaskTypeIcon taskType={taskType.type} className='task-type-icon' />}
            <span className="task-bubble-task-name">{name.getTaskName(props.task)}</span>
            {!isSelected && <div className="task-bubble-status"></div>}
            {isSelected && !isRunning && <TestRunIcon className="test-run-icon" onClick={testRunTask}/>}
            {isSelected && isRunning && <RunningIcon className="running-icon" />}
        </div>
        {isSelected && <div className="task-bubble-container-selected-bottom-edge">
            <div className="task-bubble-container-selected-bottom-edge-intersection" />
        </div>}
    </div>);
}