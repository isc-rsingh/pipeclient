import { useDrag } from 'react-dnd';
import { baseURL } from '../../services/api';
import { DragItemTypes } from '../../services/dragitemtypes';

import './availabletask.css';

function AvailableTask(props:any):JSX.Element {
    const {icon, name, description, type} = props;

    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragItemTypes.TaskType,
        item: {name,type},
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      }))
      
    return (
        <div className='task-type-item' key={'tt'+name} ref={drag}>
            <img src={baseURL + icon} className='task-type-icon' alt={description}></img>
            <span className='task-type-text'>{name}</span>
        </div>)
}

export default AvailableTask;