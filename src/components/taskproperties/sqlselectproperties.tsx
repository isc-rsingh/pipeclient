import { Button, TextareaAutosize } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Task } from "../../models/task";
import { setTaskProperty } from "../../stores/pipeline-editor-store";
import "./sqlselectproperties.css";

export interface SqlSelectPropertiesProps {
    task:Task
}

export default function SqlSelectProperties(props):JSX.Element {
    const [sqlStatement,setSqlStatement] = useState(props.task.compute.template.sql || '')
    const dispatch=useDispatch();
    
    function sqlStatementChange(ev) {
        setSqlStatement(ev.target.value);
    }

    function saveChanges() {
        dispatch(setTaskProperty({
            task:props.task,
            value:sqlStatement,
            path:'compute.template.sql'
        }));
    }

    function discardChanges() {
        setSqlStatement(props.task.compute.template.sql || '');
    }

    return (<div className="sql-select-properties-container">
        <div className="sql-select-properties-sql-header">SQL Statement</div>
        <div>
            <TextareaAutosize placeholder="SQL Statement" value={sqlStatement} onChange={sqlStatementChange} className="sql-select-properties-sql-input" minRows={10} />
        </div>

        <div className="sql-select-button-bar"><Button variant="contained" className="sql-select-save-button" onClick={saveChanges}>Save Changes</Button><Button variant="outlined" className="sql-select-discard-button" onClick={discardChanges}>Discard Changes</Button></div>
    </div>);
}