import { baseURL } from '../../services/api';
import { DragItemTypes } from '../../services/dragitemtypes';

import './availabletask.css';

function AvailableTask(props:any):JSX.Element {
    const {icon, name, description, type} = props;

    function dragStart(ev, taskType:string) {
      ev.dataTransfer.setData(DragItemTypes.TaskType, taskType);
    }

    return (
        <div className='task-type-item' key={'tt'+name} draggable="true" onDragStart={(ev)=>{dragStart(ev, type)}}>
            <img src={baseURL + icon} className='task-type-icon' alt={description}></img>
            <span className='task-type-text'>{name}</span>
        </div>)
}

export default AvailableTask;