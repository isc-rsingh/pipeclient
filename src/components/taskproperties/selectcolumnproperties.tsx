import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Task } from "../../models/task";
import { taskHelper } from "../../services/taskHelper";
import Select from 'react-select';
import { setTaskProperty } from "../../stores/pipeline-editor-store";

import "./selectcolumnproperties.css";

export interface SelectColumnPropertiesProp {
    task:Task
}

export default function SelectColumnProperties(props:SelectColumnPropertiesProp) {
    const pipeline = useSelector((p:any)=>p.pipelineEditor.value);
    const dispatch = useDispatch();
    const [outputfields, setOutputFields] = useState(props.task.compute.template.fields || []);

    const fieldOptions = taskHelper.getFieldsForTask(pipeline, props.task.taskid).map(f=>{
        return {
            label: f.name,
            value: f.name,
        }
    });

    function outputFieldsChange(ev) {
        console.log(ev);
        setOutputFields(ev.map(f=>f.value));
    }

    function saveChanges() {
        dispatch(setTaskProperty({
            task:props.task,
            value:outputfields,
            path:'compute.template.fields'
        }));
    }

    function discardChanges() {
        setOutputFields(props.task.compute.template.outputfields || []);
    }

    const outputFieldsValue = fieldOptions.filter(fo=>outputfields.includes(fo.value));
    return (
        <div className="select-column-properties-container">
            <div className="select-column-input-header">Fields to include in output</div>
            <div>
                <Select options={fieldOptions} isMulti={true} value={outputFieldsValue} onChange={outputFieldsChange}></Select>
            </div>

            <div className="select-column-button-bar"><Button variant="contained" className="select-column-save-button" onClick={saveChanges}>Save Changes</Button><Button variant="outlined" className="select-column-discard-button" onClick={discardChanges}>Discard Changes</Button></div>
        </div>
    )
}