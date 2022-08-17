import { Component} from 'react';
import './availabletasks.css';
import {api} from '../../services/api';
import { baseURL } from '../../services/api';
import { ITaskType } from '../../models/tasktype';

class AvailableTasksState {
    tasks:ITaskType[] = []
}

class AvailableTasks extends Component {
    state = new AvailableTasksState();
        
    componentDidMount() {
        api.getAllTaskTypes().then(x=>{
            this.setState({
                tasks:x
            });
        })  
    }
    
    render() {
        return (
        <div className='task-types-container'>
            {this.state.tasks.map(t=>{
                return (
                <div className='task-type-item' key={'tt'+t.name}>
                    <img src={baseURL + t.icon} className='task-type-icon' alt={t.description}></img>
                    <span className='task-type-text'>{t.name}</span>
                </div>)
            })}
        </div>)
    }
}

export default AvailableTasks;