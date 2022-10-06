import { useState } from "react";
import { Task } from "../../models/task";
import "./groupbyproperties.css";

export interface GroupByPropertiesProps {
    task:Task
}

export default function GroupByProperties(props:GroupByPropertiesProps) {

    const [groupFields, setGroupFields] = useState(props.task.compute.template.groupfields || []);
    
    return (<div className="group-by-properties-container">
        <div className="group-by-section-wrapper">
            <label className="group-by-section-wrapper-label">Field to group by</label>
            <div className="group-by-field-label">Choose source field(s)</div>
            <div className="group-by-select">

            </div>
            <div className="group-by-field-label">Label this output column <span className="group-by-optional">(optional)</span></div>
            <div className="group-by-select">
                
            </div>
        </div>

        <div className="group-by-section-wrapper">
            <label className="group-by-section-wrapper-label">Data options</label>
            <div className="group-by-field-label">Choose source to populate the Pivot output</div>
            <div className="group-by-select">

            </div>
            <div className="group-by-field-label">Choose a function to summarize the data</div>
            <div className="group-by-select">

            </div>
            <div className="group-by-field-label">Label this output column <span className="group-by-optional">(optional)</span></div>
            <div className="group-by-select">
                
            </div>
        </div>
    </div>)
}