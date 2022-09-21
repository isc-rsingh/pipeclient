import * as React from 'react';
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import { api, ICatalogTaskResponse } from '../../services/api';
import {name} from '../../services/name';

import './pipelineeditormenu.css';
import { ITaskType } from '../../models/tasktype';
import AvailableTask from '../availabletask/availabletask';
import { DragItemTypes } from '../../services/dragitemtypes';


export enum menuButton {
    taskProperties,
    runPipeline,
    newTask,
    addTask,
    copyTasks,
    pasteTasks,
    deleteTasks
}
export interface PipelineEditorMenuProps {
    menuPressed: (button:menuButton)=>void;
}

function PipelineEditorMenu(props:PipelineEditorMenuProps):JSX.Element {
    const [taskTypesAnchorEl, setTaskTypesAnchorEl] = React.useState<null | SVGSVGElement>(null);
    const [taskAnchorEl, setTaskAnchorEl] = React.useState<null | SVGSVGElement>(null);
    const [taskTypes, setTaskTypes] = React.useState<ITaskType[]>([]);
    const [tasks, setTasks] = React.useState<ICatalogTaskResponse[]>([]);
    const taskTypeMenuOpen = Boolean(taskTypesAnchorEl);
    const taskMenuOpen = Boolean(taskAnchorEl);
    
    const handleTaskTypeClick = (event: React.MouseEvent<SVGSVGElement>) => {
        api.getAllTaskTypes().then((tt)=>{
            setTaskTypes(tt);
        });
        setTaskTypesAnchorEl(event.currentTarget);
    };

    const handleTaskClick = (event: React.MouseEvent<SVGSVGElement>) => {
        api.getCatalog().then((cat)=>{
            setTasks(cat.tasks);
        });
        setTaskAnchorEl(event.currentTarget);
    };
    
    const handleTaskTypeClose = () => {
        setTaskTypesAnchorEl(null);
    };

    const handleTaskClose = () => {
        setTaskAnchorEl(null);
    }; 

    function dragExistingTaskStart(ev, taskid) {
        ev.dataTransfer.setData(DragItemTypes.Task, taskid);
    }

    return (
    <nav className='pipeline-editor-menu-container'>
        <List>
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <CreateOutlinedIcon onClick={()=>props.menuPressed(menuButton.taskProperties)}/>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <PlayArrowOutlinedIcon onClick={()=>props.menuPressed(menuButton.runPipeline)}/>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <PostAddOutlinedIcon onClick={handleTaskTypeClick}/>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <AddTaskOutlinedIcon onClick={handleTaskClick}/>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <ContentCopyOutlinedIcon onClick={()=>props.menuPressed(menuButton.copyTasks)}/>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <AppsOutlinedIcon onClick={()=>props.menuPressed(menuButton.pasteTasks)}/>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <DeleteOutlineOutlinedIcon onClick={()=>props.menuPressed(menuButton.deleteTasks)}/>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
        </List>
        <Menu open={taskTypeMenuOpen} onClose={handleTaskTypeClose} anchorEl={taskTypesAnchorEl}>
            {taskTypes.map((tt)=>{
                return (
                <MenuItem key={tt.name}>
                     <AvailableTask name={tt.name} description={tt.description} icon={tt.icon} type={tt.type} />
                </MenuItem>)
            })}
        </Menu>

        <Menu open={taskMenuOpen} onClose={handleTaskClose} anchorEl={taskAnchorEl}>
            {tasks.map((t)=>{
                return (
                    <MenuItem key={t.taskid}>
                        <ListItemIcon draggable="true" onDragStart={(ev)=>{dragExistingTaskStart(ev,t.taskid)}}><TaskAltIcon></TaskAltIcon></ListItemIcon>
                        <ListItemText>{name.getTaskName(t)}</ListItemText>
                    </MenuItem>
                )
            })}
        </Menu>
    </nav>
    )
}

export default PipelineEditorMenu;