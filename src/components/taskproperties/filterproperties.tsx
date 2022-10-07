import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Task } from "../../models/task";
import { taskHelper } from "../../services/taskHelper";
import { setTaskProperty } from "../../stores/pipeline-editor-store";
import Select from 'react-select';

import "./filterproperties.css";

export interface FilterPropertiesProp {
    task:Task
}

export default function FilterProperties(props:FilterPropertiesProp):JSX.Element {
    const pipeline = useSelector((p:any)=>p.pipelineEditor.value);
    const dispatch = useDispatch();
    const [filter, setFilter] = useState(props.task.compute.template.filter || '');
    const [outputfields, setOutputFields] = useState(props.task.compute.template.outputfields || []);

    const fieldOptions = taskHelper.getFieldsForTask(pipeline, props.task.taskid).map(f=>{
        return {
            label: f.name,
            value: f.name,
        }
    });

    const outputFieldsValue = fieldOptions.filter(fo=>outputfields.includes(fo.value));

    function filterChange(ev) {
        setFilter(ev.target.value);
    }

    function outputFieldsChange(ev) {
        console.log(ev);
        setOutputFields(ev.map(f=>f.value));
    }

    function saveChanges() {
        dispatch(setTaskProperty({
            task:props.task,
            value:filter,
            path:'compute.template.filter'
        }));

        dispatch(setTaskProperty({
            task:props.task,
            value:outputfields,
            path:'compute.template.outputfields'
        }));
    }

    function discardChanges() {
        setFilter(props.task.compute.template.filter || '');
        setOutputFields(props.task.compute.template.outputfields || []);
    }
    
    return (
        <div className="filter-properties-container">
            <div className="filter-input-header">Filter criteria</div>
            <div>
                <TextField placeholder={"Filter criteria"} value={filter} onChange={filterChange} className='filter-properties-criteria-input' variant={'outlined'} size='small'/>
            </div>

            <div className="filter-input-header">Fields to include in output</div>
            <div>
                <Select options={fieldOptions} isMulti={true} value={outputFieldsValue} onChange={outputFieldsChange}></Select>
            </div>

            <div className="filter-button-bar"><Button variant="contained" className="filter-save-button" onClick={saveChanges}>Save Changes</Button><Button variant="outlined" className="filter-discard-button" onClick={discardChanges}>Discard Changes</Button></div>
        </div>
    )
}