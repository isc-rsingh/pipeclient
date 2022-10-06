import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Task } from "../../models/task";
import { setTaskProperty } from "../../stores/pipeline-editor-store";

import "./filterproperties.css";

export interface FilterPropertiesProp {
    task:Task
}

export default function FilterProperties(props:FilterPropertiesProp):JSX.Element {
    const [filter, setFilter] = useState(props.task.compute.template.filter || '');
    const [outputfields, setOutputFields] = useState(props.task.compute.template.outputfields || []);

    function filterChange(ev) {
        setFilter(ev.target.value);
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

            <div className="filter-button-bar"><Button variant="contained" className="filter-save-button" onClick={saveChanges}>Save Changes</Button><Button variant="outlined" className="filter-discard-button" onClick={discardChanges}>Discard Changes</Button></div>
        </div>
    )
}

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
