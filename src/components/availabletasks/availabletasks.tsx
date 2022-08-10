import React, { Component } from 'react';
import './availabletasks.css';
import API from '../../services/api';
import { ITaskType } from '../../models/tasktype';
import {ReactComponent as IconSettings} from './icon-settings.svg';
import {ReactComponent as IconArrowDown} from './icon-arrow-down.svg';
class AvailableTasksState {
    tasks:ITaskType[] = []
}
class AvailableTasks extends Component {

    constructor(props:any) {
        API.get('tasktypes').then(x=>{
            this.setState({
                tasks:x.data
            });
        })
        super(props);
    }
    state = new AvailableTasksState();

    render() {
        return (
            <div className='task-types-container'>
                <div className='task-types-header'>
                    <IconArrowDown className='list-open-icon' stroke="#f9f9f9" fill="#f9f9f9"/>
                    <span className='type-type-header-text'>Task Types</span>
                    </div>
                {this.state.tasks.map(t=>{
                    return (
                    <div className='task-type-item'>
                        <IconSettings className='task-type-icon'/>
                        <span className='task-type-text'>{t.name}</span>
                    </div>)
                })}
            </div>
        )
    }
}

export default AvailableTasks;