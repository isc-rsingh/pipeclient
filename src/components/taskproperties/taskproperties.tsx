import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../../models/task';
import { ITaskType } from '../../models/tasktype';
import { api, baseURL } from '../../services/api';
import { name } from '../../services/name';

import { ReactComponent as EditIcon } from "../../assets/icons/type_edit.svg";
import { ReactComponent as CompletedIcon } from "../../assets/icons/type_completed.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/type_close.svg";

import './taskproperties.css';
import { TaskTypes } from '../../services/taskTypeHelper';
import FieldComputeProperties from './fieldcomputeproperties';
import TaskTypeIcon from '../tasktypeicon/tasktypeicon';
import { setTaskProperty } from '../../stores/pipeline-editor-store';

function TaskProperties(props): JSX.Element {
    
    const selectedTask:Task = useSelector((state:any)=>state.uiState.value.taskBeingEditted);
    const [taskType, setTaskType] = useState<ITaskType | null>(null);
    const [editTaskName,setEditTaskName] = useState(false);
    const [taskName, setTaskName] = useState(name.getTaskName(selectedTask));
    const dispatch = useDispatch();
    
    function toggleEditName() {
        setEditTaskName(!editTaskName);
    }

    function taskNameChange(ev) {
        setTaskName(ev.target.value);
    }

    function saveTaskName() {
        dispatch(setTaskProperty({
            task:selectedTask,
            path:'metadata.name',
            value:taskName
        }));
        setTaskName(taskName);
        toggleEditName();
    }

    function discardNameChange() {
        setTaskName(name.getTaskName(selectedTask));
        toggleEditName();
    }

    useEffect(()=>{
        api.getAllTaskTypes().then((tt)=>{
            if (!selectedTask) return;

            const t = tt.find(x=>x.type === selectedTask.type);
            if (t) {
                setTaskType(t);
            }
        });
    });

    if (!selectedTask) return null;

    let editorComponent;
    switch (selectedTask.type) {
        case TaskTypes.TaskFieldComplete:
            editorComponent = <FieldComputeProperties task={selectedTask} />;
            break;
        default:
            editorComponent = <h1>Task type not supported</h1>
    }
    return (<div className='task-properties-container' >
        <div className='task-properties-container-header'>
            {taskType && <TaskTypeIcon taskType={taskType.type} className='task-properties-task-type-icon' />}
            {!editTaskName && <span className='task-properties-header-text'>{name.getTaskName(selectedTask)}</span>}
            {editTaskName && <input type="text" placeholder={"Task name"} value={taskName} onChange={taskNameChange} className='task-properties-task-name-input' /> }
            {!editTaskName && <EditIcon onClick={toggleEditName}/>}
            {editTaskName && <CompletedIcon onClick={saveTaskName} />}
            {editTaskName && <CloseIcon onClick={discardNameChange}/>}
        </div>
        <div className='task-properties-task-description'>
            {selectedTask.metadata.description || selectedTask.metadata.autodescription}
        </div>
        {editorComponent}               
    </div>);
}

export default TaskProperties;