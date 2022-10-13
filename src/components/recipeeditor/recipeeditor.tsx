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
import { addTask, addTaskToRecipe, removeTaskFromRecipe, setTaskProperty } from "../../stores/pipeline-editor-store";
import { api } from "../../services/api";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import AvailableTask from "../availabletask/availabletask";
import React from "react";
import { Pipeline } from "../../models/pipeline";
import { taskHelper } from "../../services/taskHelper";
import TaskBubble from "../taskbubble/taskbubble";
import { setDataPreview, setTaskIdBeingEdited } from "../../stores/ui-state-store";
import TaskProperties from "../taskproperties/taskproperties";
import DataPreview from "../datapreview/datapreview";
import { NameDialog } from "../nameDialog/nameDialog";
import { createTemplate } from "../../services/taskTypeHelper";
import useForceUpdate from "../../hooks/useForceUpdate";
import taskRunService from "../../services/taskRunService";

export default function RecipeEditor(props):JSX.Element {

    const pipeline: Pipeline = useSelector((state:any)=>state.pipelineEditor.value);
    const selectedTaskId:string = useSelector((state:any)=>state.uiState.value.selectedTaskId);
    const taskPreviewData:any[] = useSelector((state:any)=>state.uiState.value.previewData);
    const [editDescription,setEditDescription] = useState(false);
    
    const t = pipeline.taskCopies.find(tc=>tc.taskid===selectedTaskId);

    const [description, setDescription] = useState(t?.metadata?.description || '');
    const [taskTypes, setTaskTypes] = useState([]);
    const [imageIdx] = useState(Math.floor(Math.random() * 5));
    const [taskTypesAnchorEl, setTaskTypesAnchorEl] = React.useState<null | SVGSVGElement>(null);
    const taskTypeMenuOpen = Boolean(taskTypesAnchorEl);
    const [openNameDialog, setOpenNameDialog]=useState(false);
    const [newTaskType, setNewTaskType]=useState("");
    const forceUpdate = useForceUpdate();
    const dispatch = useDispatch();

    const sourceTasks = taskHelper.getTasksForRecipe(t,pipeline);
    const taskIdBeingEditted:string = useSelector((s:any) => s.uiState.value.taskIdBeingEditted);
    
    
    useEffect(()=>{
        api.getAllTaskTypes().then((tt)=>{
            setTaskTypes(tt);
        });
    });

    useEffect(()=>{
            let firstErroredTaskId = null;
            sourceTasks.forEach(t=>{
                if(!firstErroredTaskId) {
                    if (t.metadata.lasterror) {
                        firstErroredTaskId = t.taskid;
                    }
                }
            });
            dispatch(setTaskIdBeingEdited(firstErroredTaskId));
    },[selectedTaskId]);

    useEffect(()=>{
        if (taskIdBeingEditted) {
            api.getDataPreview(selectedTaskId).then(x=>{
                dispatch(setDataPreview(x.children));
            });
        }
    },[taskIdBeingEditted])

    const taskBeingEditted:Task = pipeline.taskCopies.find(tc=>tc.taskid===taskIdBeingEditted);

    if (!selectedTaskId) {return;}

    function toggleDescription()     {
        setEditDescription(!editDescription);
    }

    function descriptionChange(ev) {
        setDescription(ev.target.value);
    }

    function saveDescription() {
        dispatch(setTaskProperty({
            task:t,
            path:'metadata.description',
            value:description
        }));
        toggleDescription();
    }
    
    const handleTaskTypeClose = () => {
        setTaskTypesAnchorEl(null);
    };

    function handleTaskOpen(event) {
        setTaskTypesAnchorEl(event.currentTarget);
    }

    function addTaskOfType(taskType:string) {
        setNewTaskType(taskType);
        setOpenNameDialog(true);
    }

    async function newTaskNamed(taskName) {
        if (taskName) {
            setOpenNameDialog(false);
            //Create task of type
            const newTaskSkeleton = await api.createEmptyTask(newTaskType, pipeline.pipelineid, taskName);
                newTaskSkeleton.type = newTaskType;
                
                const newTask = await createTemplate(newTaskSkeleton,pipeline.pipelineid);
                const lastSourceTask = sourceTasks.length ? sourceTasks[sourceTasks.length-1] : null;
                const copyPropsFrom = taskBeingEditted?.metadata?.properties || lastSourceTask?.metadata?.properties;
                if (copyPropsFrom) {
                    newTask.metadata.properties = [...copyPropsFrom];;
                }
                
                dispatch(addTask(newTask));
                dispatch(addTaskToRecipe({
                    taskid:newTask.taskid,
                    recipetaskid: selectedTaskId,
                    aftertask:taskBeingEditted?.taskid
                }));

            handleTaskTypeClose();
            refreshDisplay();
        }
    }

    function removeSelectedTaskFromRecipe() {
        if (taskIdBeingEditted) {
            dispatch(removeTaskFromRecipe({
                taskid:taskIdBeingEditted,
                recipetaskid: selectedTaskId
            }));
            refreshDisplay();
            dispatch(setTaskIdBeingEdited(null));
        }
    }

    function refreshDisplay() {
        forceUpdate();
    }

    function runRecipe() {
        taskRunService.runTask(selectedTaskId);
    }

    return (
        <div className="recipe-editor-container">
            <div className="recipe-editor-header">
                <RecipeIcon className="recipe-editor-header-icon" />
                <h1 className="recipe-editor-recipe-name">{name.getTaskName(t)}</h1>
                { !editDescription && <span className="recipe-editor-recipe-description">{description || 'Description...'}</span> }
                { editDescription && <input type="text" placeholder={"Enter description"} value={description} onChange={descriptionChange} className='recipe-editor-recipe-description' /> }
                { !editDescription && <EditIcon className="recipe-editor-edit-icon" onClick={toggleDescription} /> }
                { editDescription && <CompletedIcon className="recipe-editor-edit-icon" onClick={saveDescription}/>}
                { editDescription && <CloseIcon className="recipe-editor-edit-icon" onClick={toggleDescription} />}
                <div className="recipe-editor-last-modified">
                    <UserAvatar label="Last modified by:" index={imageIdx}></UserAvatar>
                </div>
            </div>
            <div className="recipe-editor-subheader">
                <div className="recipe-editor-toolbar-container">
                    <AddTaskIcon className="recipe-editor-add-task-icon"/>
                    <Button onClick={handleTaskOpen} endIcon={<DropDownIcon />} className='recipe-editor-new-task-button'>New Task </Button>
                    <Menu open={taskTypeMenuOpen} onClose={handleTaskTypeClose} anchorEl={taskTypesAnchorEl}>
                        {taskTypes.map((tt)=>{
                            return (
                            <MenuItem key={tt.name} onClick={()=>addTaskOfType(tt.type)}>
                                <AvailableTask name={tt.name} description={tt.description} icon={tt.icon} type={tt.type} />
                            </MenuItem>)
                        })}
                    </Menu>
                    <Divider orientation="vertical" />
                    <RunIcon className="recipe-editor-run-icon" onClick={runRecipe}/>
                    <DeleteIcon className="recipe-editor-delete-icon" onClick={removeSelectedTaskFromRecipe} />
                </div>
            </div>
            <div className="recipe-editor-task-and-data-container">
                <div className="recipe-editor-task-properties-container">
                    <div className="recipe-editor-task-list">
                            {sourceTasks.map((t)=>{
                                return <TaskBubble task={t} key={t.taskid} />
                            })}
                    </div>
                    {t && <TaskProperties /> }
                </div>
                <DataPreview data={taskPreviewData} task={taskBeingEditted || t} />
            </div>
            <NameDialog open={openNameDialog} title={'Task Name'} onClose={newTaskNamed} ></NameDialog>
        </div>
    );
}