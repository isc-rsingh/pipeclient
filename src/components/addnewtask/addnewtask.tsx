import React from 'react';
import Dialog from '@mui/material/Dialog';
import { Divider, Input, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TaskIcon from '@mui/icons-material/Task';

import "./addnewtask.css";
import { ITaskType } from '../../models/tasktype';
import { api, ICatalogTaskResponse } from '../../services/api';
import { baseURL } from '../../services/api';
import { name } from '../../services/name';
import { Task } from '../../models/task';
import { addExistingTask } from '../../stores/pipeline-editor-store';
import { connect } from 'react-redux';
import { closeAddNewTaskDialog } from '../../stores/ui-state-store';

export interface AddNewTaskProps {
    open:boolean;
    onClose:()=>void;
    addExistingTask:(payload:any)=>void;
    closeAddNewTaskDialog:(payload:any)=>void;
}

class AddNewTaskState {
    taskTypes:ITaskType[] = [];
    tasks:ICatalogTaskResponse[] = [];
}

class AddNewTask extends React.Component<AddNewTaskProps> {
    state = new AddNewTaskState();

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const taskTypes = await api.getAllTaskTypes();
        const catalog = await api.getCatalog();
        const decentTasks = catalog.tasks.filter(t=>['rs.pipeline.TaskSQLSelect','rs.pipeline.TaskPersistent'].includes(t.type));
        this.setState({taskTypes, tasks:decentTasks});
    }

    private checkTaskForDependents(t:Task) {
        if (!t.source || !t.source.tasks || !t.source.tasks.length) {
            this.props.addExistingTask(t);
            this.props.closeAddNewTaskDialog({});
        }
        //TODO: Recurse
    }

    addNewTask(t:ICatalogTaskResponse) {
        api.getTask(t.taskid).then((t:Task)=>{
            this.checkTaskForDependents(t);
        });
    }

    render() {
        const {
            props,
        } = this;

        const taskAdornment = (<InputAdornment position="start"><SearchIcon></SearchIcon></InputAdornment>);

        return (<div className="add-new-task-container">
                <Dialog open={props.open} onClose={props.onClose}>
                    <Input placeholder='Search Tasks' startAdornment={taskAdornment}></Input>
                    <div className='existing-task-container'>
                        <div>Tasks</div>
                        <Divider></Divider>
                        {this.state.tasks.map((t:ICatalogTaskResponse)=>{
                            return (
                            <div className='task-item' key={'tsk'+t.taskid} onClick={()=>this.addNewTask(t)}>
                                <TaskIcon></TaskIcon>
                                <span className='task-text'>{name.getTaskName(t)}</span>
                            </div>
                            );
                        })}
                    </div>
                    <div className='task-types-container'>
                        <div>New Tasks</div>
                        <Divider></Divider>
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
const mapDispatchToProps = (dispatch) => {
    return {
        addExistingTask:(payload) => dispatch(addExistingTask(payload)),
        closeAddNewTaskDialog:(payload) => dispatch(closeAddNewTaskDialog(payload)),
    }
}
export default connect(null, mapDispatchToProps)(AddNewTask);