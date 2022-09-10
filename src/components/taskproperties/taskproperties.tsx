import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { name } from '../../services/name';
import { Task } from '../../models/task';
import TaskProperty from '../taskproperty/taskproperty';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTaskName } from '../../stores/pipeline-editor-store';

import './taskproperties.css';

function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

const edittableProperties = {
    'source.tasks':'Input Source',
    'compute.template.targetfield':'Target Field',
    'compute.operation':'Operation',
}

function inspectPropertiesDeep(parent:string, inspectObj:any, existingValues:any[]) {
    const keys = Object.keys(inspectObj);

    keys.forEach((k)=>{
        const keyName = parent + '.' + k;
        if (is('String',inspectObj[k]) || is('Number',inspectObj[k]) || is('Array',inspectObj[k])) {
            if (edittableProperties[keyName]) {
                existingValues.push(keyName);
            }
        } else {
            inspectPropertiesDeep(keyName, inspectObj[k], existingValues);
        }
    });
}

function getEditableProperties(task:Task):string[] {
    if (!task.compute) return [];
    const rslt=[];
    inspectPropertiesDeep('source',task.source,rslt);
    inspectPropertiesDeep('compute',task.compute,rslt);
    return rslt;
}

export interface ITaskPropertiesProps {
    task:Task;
    onClose:()=>void;
}

function TaskProperties(props:ITaskPropertiesProps): JSX.Element {
    const { task,onClose } = props;
    const [isEditingstate, isEditingSetState] = useState(false);
    const dispatch = useDispatch();
    
    if (!task) return null;

    const propsToEdit = getEditableProperties(task);

    function toggleNameEdit() {
        isEditingSetState(!isEditingstate);
    }

    function updateTaskName(event) {
        dispatch(setTaskName({task:task, name:event.target.value}));
    }

    let taskNameComponent;
    if (isEditingstate) {
        taskNameComponent = (<div>
            <span onClick={toggleNameEdit}>Task</span> <input type='text' value={task.metadata.name} onChange={updateTaskName.bind(this)} className='task-name-input'></input>
            </div>);
    } else {
        taskNameComponent = (<div onClick={toggleNameEdit}>Task {name.getTaskName(task)}</div>);
    }

    return (<div className='task-properties-container' >
        <h2 className="section-header">
            Task Builder
            <span className='close-icon'>
                <FontAwesomeIcon icon={faClose} onClick={onClose} />
            </span>
        </h2>
        <h2>
            {taskNameComponent}
        </h2>
        {propsToEdit.map(x=>{
            return (<TaskProperty task={task} caption={edittableProperties[x]} propertyPath={x} key={task.taskid + x}/>)
        })}
        
    </div>);
}

export default TaskProperties;