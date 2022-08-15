import React, { Component, useEffect, useState } from 'react';
import './availabletasks.css';
import API from '../../services/api';
import { baseURL } from '../../services/api';
import { ITaskType } from '../../models/tasktype';
import { ReactComponent as IconSettings } from './icon-settings.svg';

class AvailableTasksState {
    tasks:ITaskType[] = []
}

function AvailableTasks() {
            const [state, setState] = useState({tasks:[] as ITaskType[]});
            
            useEffect(()=>{
                API.get('/vnx/tasktypes').then(x=>{
                    setState({
                        tasks:x.data
                    });
                })                
            });

            return (
            <div className='task-types-container'>
                {state.tasks.map(t=>{
                    return (
                    <div className='task-type-item' key={'tt'+t.name}>
                        <img src={baseURL + t.icon} className='task-type-icon'></img>
                        <span className='task-type-text'>{t.name}</span>
                    </div>)
                })}
            </div>
        )
}

export default AvailableTasks;