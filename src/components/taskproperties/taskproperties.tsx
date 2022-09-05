
import './taskproperties.css';

function TaskProperties(props:any): JSX.Element {
    const { task } = props;
    if (!task) return null;
    
    return (<section className='task-properties-container' />);
}

export default TaskProperties;