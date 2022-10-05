import { Button, Input, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Task } from "../../models/task"
import { setTaskProperty } from "../../stores/pipeline-editor-store";

import "./fieldcomputeproperties.css";

export interface FieldComputePropertiesProps {
    task:Task
}
export default function FieldComputeProperties(props:FieldComputePropertiesProps) {
    const [formula, setFormula ] = useState(props.task.compute.template.operation || '');
    const [targetField, setTargetField ] = useState(props.task.compute.template.targetfield || '');
    const dispatch=useDispatch();
    
    function formulaChange(ev) {
        setFormula(ev.target.value);
    }

    function targetFieldChange(ev) {
        setTargetField(ev.target.value);
    }

    function saveChanges() {
        dispatch(setTaskProperty({
            task:props.task,
            value:formula,
            path:'compute.template.operation'
        }));

        dispatch(setTaskProperty({
            task:props.task,
            value:targetField,
            path:'compute.template.targetfield'
        }));
    }

    function discardChanges() {
        setFormula(props.task.compute.template.operation || '');
        setTargetField(props.task.compute.template.targetfield || '');
    }
    
    return (<div className="field-compute-properties-container">
        <div className="field-compute-input-header">Formula to Compute</div>
        <div>
            <TextField placeholder={"Formula to compute"} value={formula} onChange={formulaChange} className='field-compute-properties-formula-input' variant={'outlined'} size='small'/>
        </div>
        <div className="field-compute-input-header">Output field label</div>
        <div><TextField placeholder={"Output field label"} value={targetField} onChange={targetFieldChange} className='field-compute-properties-target-field-input' variant={'outlined'} size='small'/></div>

        <div className="field-compute-button-bar"><Button variant="contained" className="field-compute-save-button" onClick={saveChanges}>Save Changes</Button><Button variant="outlined" className="field-compute-discard-button" onClick={discardChanges}>Discard Changes</Button></div>
    </div>)
}