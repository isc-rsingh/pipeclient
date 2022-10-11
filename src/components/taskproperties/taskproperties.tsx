import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../../models/task';
import { ITaskType } from '../../models/tasktype';
import { api } from '../../services/api';
import { name } from '../../services/name';

import { ReactComponent as EditIcon } from "../../assets/icons/type_edit.svg";
import { ReactComponent as EditDescriptionIcon } from "../../assets/icons/type_edit.svg";
import { ReactComponent as CompletedIcon } from "../../assets/icons/type_completed.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/type_close.svg";

import './taskproperties.css';
import { TaskTypes } from '../../services/taskTypeHelper';
import FieldComputeProperties from './fieldcomputeproperties';
import TaskTypeIcon from '../tasktypeicon/tasktypeicon';
import { setTaskProperty } from '../../stores/pipeline-editor-store';
import SqlSelectProperties from './sqlselectproperties';
import FilterProperties from './filterproperties';
import JoinProperties from './joinproperties';
import GroupByProperties from './groupbyproperties';
import SelectColumnProperties from './selectcolumnproperties';
import { Pipeline } from '../../models/pipeline';

function TaskProperties(props): JSX.Element {
    
    const selectedTaskId:string = useSelector((state:any)=>state.uiState.value.taskIdBeingEditted);
    const pipeline:Pipeline = useSelector((state:any)=>state.pipelineEditor.value);
    const [taskType, setTaskType] = useState<ITaskType | null>(null);
    const [editTaskName,setEditTaskName] = useState(false);
    const [editTaskDescription, setEditTaskDescription] = useState(false);
    const selectedTask: Task = pipeline.taskCopies.find(tc=>tc.taskid===selectedTaskId);
    const [taskName, setTaskName] = useState(name.getTaskName(selectedTask));
    const [taskDescription, setTaskDescription] = useState(selectedTask?.metadata?.description);

    const dispatch = useDispatch();
    
    function toggleEditName() {
        setEditTaskName(!editTaskName);
    }

    function toggleTaskDescription() {
        setEditTaskDescription(!editTaskDescription);
    }

    function taskNameChange(ev) {
        setTaskName(ev.target.value);
    }

    function taskDescriptionChange(ev) {
        setTaskDescription(ev.target.value);
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

    function saveTaskDescription() {
        dispatch(setTaskProperty({
            task:selectedTask,
            path:'metadata.description',
            value:taskDescription
        }));
        setTaskDescription(taskDescription);
        toggleTaskDescription();
    }

    function discardTaskDescription() {
        setTaskDescription(selectedTask.metadata.description);
        toggleTaskDescription();
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

    useEffect(()=>{
        setTaskName(name.getTaskName(selectedTask));
        setTaskDescription(selectedTask?.metadata?.description || '');
    },[selectedTask])

    if (!selectedTask) return null;

    let editorComponent;
    switch (selectedTask.type) {
        case TaskTypes.TaskSelectColumns:
            editorComponent = <SelectColumnProperties task={selectedTask} />;
            break;
        case TaskTypes.TaskFieldComplete:
            editorComponent = <FieldComputeProperties task={selectedTask} />;
            break;
        case TaskTypes.TaskGroupBy:
            editorComponent = <GroupByProperties task={selectedTask} />;
            break;
        case TaskTypes.TaskJoin:
            editorComponent = <JoinProperties task={selectedTask} />;
            break;
        case TaskTypes.TaskSQLSelect:
            editorComponent = <SqlSelectProperties task={selectedTask} />;
            break;
        case TaskTypes.TaskFilter:
            editorComponent = <FilterProperties task={selectedTask} />;
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
            {!editTaskDescription && (taskDescription || selectedTask.metadata.autodescription || 'Enter description...')}
            {editTaskDescription && <textarea placeholder={"Enter description..."} value={taskDescription} onChange={taskDescriptionChange} className='task-properties-task-description-input' rows={5} /> }
            {!editTaskDescription && <EditDescriptionIcon onClick={toggleTaskDescription} className='task-properties-description-icon'/>}
            {editTaskDescription && <CompletedIcon onClick={saveTaskDescription}  className='task-properties-description-icon'/>}
            {editTaskDescription && <CloseIcon onClick={discardTaskDescription} className='task-properties-description-icon'/>}
        </div>
        {editorComponent}               
    </div>);
}

export default TaskProperties;