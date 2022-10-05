import { useDispatch, useSelector } from "react-redux";
import { Task } from "../../models/task";

import { ReactComponent as RecipeIcon } from "../../assets/icons/type_recipe.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/type_edit.svg";
import { ReactComponent as CompletedIcon } from "../../assets/icons/type_completed.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/type_close.svg";
import { ReactComponent as AddTaskIcon } from "../../assets/icons/type_new_task.svg";
import { ReactComponent as DropDownIcon } from "../../assets/icons/type_drop_down.svg";
import { ReactComponent as RunIcon } from "../../assets/icons/type_run.svg";
import { ReactComponent as DeleteIcon } from "../../assets/icons/type_delete.svg";

import "./recipeeditor.css";
import { name } from "../../services/name";
import UserAvatar from "../useravatar/useravatar";
import { useEffect, useState } from "react";
import { setTaskProperty } from "../../stores/pipeline-editor-store";
import { api, baseURL } from "../../services/api";
import { Button, Divider, Menu, MenuItem, Select } from "@mui/material";
import AvailableTask from "../availabletask/availabletask";
import React from "react";
import { Pipeline } from "../../models/pipeline";
import { taskHelper } from "../../services/taskHelper";
import TaskBubble from "../taskbubble/taskbubble";
import { setTaskBeingEdited } from "../../stores/ui-state-store";
import TaskProperties from "../taskproperties/taskproperties";

export default function RecipeEditor(props):JSX.Element {

    const pipeline: Pipeline = useSelector((state:any)=>state.pipelineEditor.value);
    const selectedTask:Task = useSelector((state:any)=>state.uiState.value.selectedTask);
    const [editDescription,setEditDescription] = useState(false);
    const [description, setDescription] = useState(selectedTask?.metadata?.description || '');
    const [taskTypes, setTaskTypes] = useState([]);
    const [imageIdx] = useState(Math.floor(Math.random() * 5));
    const [taskTypesAnchorEl, setTaskTypesAnchorEl] = React.useState<null | SVGSVGElement>(null);
    const [taskAnchorEl, setTaskAnchorEl] = React.useState<null | SVGSVGElement>(null);
    const taskTypeMenuOpen = Boolean(taskTypesAnchorEl);
    const taskMenuOpen = Boolean(taskAnchorEl);

    const sourceTasks = taskHelper.getTasksForRecipe(selectedTask,pipeline);
    
    useEffect(()=>{
        api.getAllTaskTypes().then((tt)=>{
            setTaskTypes(tt);
        });

        if (sourceTasks.length) {
            dispatch(setTaskBeingEdited(sourceTasks[0]));
        } else {
            dispatch(setTaskBeingEdited(null));
        }
    });

    var dispatch = useDispatch();

    if (!selectedTask) {return;}

    function toggleDescription()     {
        setEditDescription(!editDescription);
    }

    function descriptionChange(ev) {
        setDescription(ev.target.value);
    }

    function saveDescription() {
        dispatch(setTaskProperty({
            task:selectedTask,
            path:'metadata.description',
            value:description
        }));
        toggleDescription();
    }
    
    const handleTaskTypeClose = () => {
        setTaskTypesAnchorEl(null);
    };

    const handleTaskClose = () => {
        setTaskAnchorEl(null);
    }; 

    function handleTaskOpen(event) {
        setTaskTypesAnchorEl(event.currentTarget);
    }

    return (
        <div className="recipe-editor-container">
            <div className="recipe-editor-header">
                <RecipeIcon className="recipe-editor-header-icon" />
                <h1 className="recipe-editor-recipe-name">{name.getTaskName(selectedTask)}</h1>
                { !editDescription && <span className="recipe-editor-recipe-description">{description || 'Description...'}</span> }
                { editDescription && <input type="text" placeholder={"Enter description"} value={description} onChange={descriptionChange} className='recipe-editor-recipe-description' /> }
                { !editDescription && <EditIcon className="recipe-editor-edit-icon" onClick={toggleDescription} /> }
                { editDescription && <CompletedIcon className="recipe-editor-edit-icon" onClick={saveDescription}/>}
                { editDescription && <CloseIcon className="recipe-editor-edit-icon" onClick={toggleDescription} />}
                <div className="recipe-editor-last-modified">
                    <UserAvatar label="Last modified by:" index={imageIdx}></UserAvatar>
                </div>
            </div>
            <div className="recipe-editor-toolbar-container">
                <AddTaskIcon className="recipe-editor-add-task-icon"/>
                <Button onClick={handleTaskOpen} endIcon={<DropDownIcon />} className='recipe-editor-new-task-button'>New Task </Button>
                <Menu open={taskTypeMenuOpen} onClose={handleTaskTypeClose} anchorEl={taskTypesAnchorEl}>
                    {taskTypes.map((tt)=>{
                        return (
                        <MenuItem key={tt.name}>
                            <AvailableTask name={tt.name} description={tt.description} icon={tt.icon} type={tt.type} />
                        </MenuItem>)
                    })}
                </Menu>
                <Divider orientation="vertical" />
                <RunIcon className="recipe-editor-run-icon" />
                <DeleteIcon className="recipe-editor-delete-icon" />
            </div>
            <div className="recipe-editor-task-properties-container">
                <div className="recipe-editor-task-list">
                        {sourceTasks.map((t)=>{
                            return <TaskBubble task={t} key={t.taskid} />
                        })}
                </div>
                {selectedTask && <TaskProperties /> }
            </div>
        </div>
    );
}