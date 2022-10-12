import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Pipeline } from "../../models/pipeline";
import { Task } from "../../models/task";
import { TaskTypes } from "../../services/taskTypeHelper";
import { name } from "../../services/name";
import Select from 'react-select';

import "./joinproperties.css";
import { useState } from "react";
import { setTaskProperty } from "../../stores/pipeline-editor-store";
import { taskHelper } from "../../services/taskHelper";

export interface JoinPropertiesProps {
    task:Task;
}

export default function JoinProperties(props:JoinPropertiesProps):JSX.Element {

    const pipeline:Pipeline = useSelector((s:any)=>s.pipelineEditor.value);
    const selectedRecipeId:string = useSelector((s:any)=>s.uiState.value.selectedTaskId);
    const taskIdBeingEditted = useSelector((s:any)=>s.uiState.value.taskIdBeingEditted);
    const [sourceTaskId,setSourceTaskId] = useState(props.task.compute.template.source.id);
    const [sourceJoinField,setSourceJoinField] = useState(props.task.compute.template.source.joinfield);
    const [referenceTaskId,setReferenceTaskId] = useState(props.task.compute.template.reference.id);
    const [referenceJoinField,setReferenceJoinField] = useState(props.task.compute.template.reference.joinfield);
    
    const validSourceTasks = pipeline.taskCopies.filter(t=>t.type===TaskTypes.TaskRecipe && t.taskid !== selectedRecipeId);

    let tasksAreAfterThisOne=false;
    const selectedRecipe = pipeline.taskCopies.find(tc=>tc.taskid===selectedRecipeId);
    taskHelper.getTasksForRecipe(selectedRecipe, pipeline).forEach((task:Task)=>{
        if (task.taskid === taskIdBeingEditted) {
            tasksAreAfterThisOne = true;
        }

        if (tasksAreAfterThisOne) {
            return;
        }

        if (task && !validSourceTasks.includes(task.taskid)) {
            validSourceTasks.push(task);
        }
    });

    const sourceOptions = validSourceTasks.map((t:Task)=>{
        return {
            label:name.getTaskName(t),
            value:t.taskid
        }
    });

    const sourceTask:Task = pipeline.taskCopies.find(x=>x.taskid===sourceTaskId);
    const sourceFieldOptions = [];
    let sourceJoinFieldOption;
    if (sourceTask) {
        sourceFieldOptions.push(...taskHelper.getFieldsForTask(pipeline, sourceTaskId).map(p=>{
            return {
                label:p.name,
                value:p.name,
            }
        }));

        sourceJoinFieldOption = sourceFieldOptions.find(x=>x.value===sourceJoinField);
    }

    const referenceTask:Task = pipeline.taskCopies.find(x=>x.taskid===referenceTaskId);
    const referenceFieldOptions = [];
    let referenceJoinFieldOption;
    if (referenceTask) {
        referenceFieldOptions.push(...taskHelper.getFieldsForTask(pipeline, referenceTaskId).map(p=>{
            return {
                label:p.name,
                value:p.name,
            }
        }));

        referenceJoinFieldOption = referenceFieldOptions.find(x=>x.value===referenceJoinField);
    }

    const selectedSourceOption = sourceOptions.find(x=>x.value === sourceTaskId);
    const selectedReferenceOption = sourceOptions.find(x=>x.value === referenceTaskId)

    function saveChanges() {
        dispatch(setTaskProperty({
            task:props.task,
            value:sourceTaskId,
            path:'compute.template.source.id'
        }));

        dispatch(setTaskProperty({
            task:props.task,
            value:sourceJoinField,
            path:'compute.template.source.joinfield'
        }));

        dispatch(setTaskProperty({
            task:props.task,
            value:referenceTaskId,
            path:'compute.template.reference.id'
        }));

        dispatch(setTaskProperty({
            task:props.task,
            value:referenceJoinField,
            path:'compute.template.reference.joinfield'
        }));
    }

    function sourceTaskIdChange(ev) {
        setSourceTaskId(ev.value);
    }

    function sourceJoinFieldChange(ev) {
        setSourceJoinField(ev.value);
    }

    function referenceTaskIdChange(ev) {
        setReferenceTaskId(ev.value);
    }

    function referenceJoinFieldChange(ev) {
        setReferenceJoinField(ev.value);
    }

    function discardChanges() {
        setSourceTaskId(props.task.compute.template.source.id);
        setSourceJoinField(props.task.compute.template.source.joinfield);
        setReferenceTaskId(props.task.compute.template.reference.id);
        setReferenceJoinField(props.task.compute.template.reference.joinfield);
    }

    return (<div className="join-properties-container">
        <div className="join-properties-table-wrapper">
            <label className="join-properties-table-wrapper-label">Source (left)</label>
            <div className="join-properties-table-field-container">
                <div className="join-properties-table">
                    <div className="join-properties-label">Source task</div>
                    <div className="join-properties-select">
                        <Select options={sourceOptions} value={selectedSourceOption} onChange={sourceTaskIdChange}/>
                    </div>
                </div>
                <div className="join-properties-field">
                    <div className="join-properties-label">Join Field</div>
                    <div className="join-properties-select">
                        <Select options={sourceFieldOptions} value={sourceJoinFieldOption} onChange={sourceJoinFieldChange} />
                    </div>
                </div>
            </div>
        </div>
        <div className="join-properties-table-wrapper">
            <label className="join-properties-table-wrapper-label">Reference (right)</label>
            <div className="join-properties-table-field-container">
                <div className="join-properties-table">
                    <div className="join-properties-label">Reference task</div>
                    <div className="join-properties-select">
                        <Select options={sourceOptions} value={selectedReferenceOption} onChange={referenceTaskIdChange}/>
                    </div>
                </div>
                <div className="join-properties-field">
                    <div className="join-properties-label">Join Field</div>
                    <div className="join-properties-select">
                        <Select options={referenceFieldOptions} value={referenceJoinFieldOption} onChange={referenceJoinFieldChange}/>
                    </div>
                </div>
            </div>
        </div>
        <div className="join-button-bar"><Button variant="contained" className="join-save-button" onClick={saveChanges}>Save Changes</Button><Button variant="outlined" className="join-discard-button" onClick={discardChanges}>Discard Changes</Button></div>
    </div>)
}

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
