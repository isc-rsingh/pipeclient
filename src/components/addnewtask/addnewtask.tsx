import React from 'react';
import Dialog from '@mui/material/Dialog';
import { Input, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import "./addnewtask.css";
import { ITaskType } from '../../models/tasktype';
import { api } from '../../services/api';
import { baseURL } from '../../services/api';

export interface AddNewTaskProps {
    open:boolean;
    onClose:()=>void;
}

class AddNewTaskState {
    taskTypes:ITaskType[] = [];
}

class AddNewTask extends React.Component<AddNewTaskProps> {
    state = new AddNewTaskState();

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const taskTypes = await api.getAllTaskTypes();
        this.setState({taskTypes});
    }

    render() {
        const {
            props,
        } = this;

        const taskAdornment = (<InputAdornment position="start"><SearchIcon></SearchIcon></InputAdornment>);

        return (<div className="add-new-task-container">
                <Dialog open={props.open} onClose={props.onClose}>
                    <Input placeholder='Search Tasks' startAdornment={taskAdornment}></Input>

                    <div className='task-types-container'>
                        <div>Tasks</div>
                        {this.state.taskTypes.map((t:ITaskType)=>{
                            return (
                                <div className='task-type-item' key={'tt'+t.name}>
                                    <img src={baseURL + t.icon} className='task-type-icon' alt={t.description}></img>
                                    <span className='task-type-text'>{t.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </Dialog>
        </div>);
    }
}

export default AddNewTask;