import { Component} from 'react';
import './availabletasks.css';
import {api} from '../../services/api';

import { ITaskType } from '../../models/tasktype';
import AvailableTask from '../availabletask/availabletask';

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
            {this.state.tasks.map((t:ITaskType)=>{
                return (
                    <AvailableTask name={t.name} description={t.description} icon={t.icon} key={t.name} type={t.type} />
                )
            })}
        </div>)
    }
}

export default AvailableTasks;