import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Task } from '../../models/task';
import { ITaskType } from '../../models/tasktype';
import { api, baseURL } from '../../services/api';
import { name } from '../../services/name';

import { ReactComponent as EditIcon } from "../../assets/icons/type_edit.svg";

import './taskproperties.css';
import { TaskTypes } from '../../services/taskTypeHelper';
import FieldComputeProperties from './fieldcomputeproperties';


function TaskProperties(props): JSX.Element {
    
    const selectedTask:Task = useSelector((state:any)=>state.uiState.value.taskBeingEditted);
    const [taskType, setTaskType] = useState<ITaskType | null>(null);
    
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
            {taskType && <img src={baseURL + taskType.icon} className='task-properties-task-type-icon' alt={taskType.description}></img>}
            <span className='task-properties-header-text'>{name.getTaskName(selectedTask)}</span>
            <EditIcon />
        </div>
        <div className='task-properties-task-description'>
            {selectedTask.metadata.description || selectedTask.metadata.autodescription}
        </div>
        {editorComponent}               
    </div>);
}

export default TaskProperties;