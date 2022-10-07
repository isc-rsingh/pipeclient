import { useState } from "react";
import { Task } from "../../models/task";
import "./groupbyproperties.css";

import Select from 'react-select';
import { taskHelper } from "../../services/taskHelper";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import { setTaskProperty } from "../../stores/pipeline-editor-store";

export interface GroupByPropertiesProps {
    task:Task
}

export default function GroupByProperties(props:GroupByPropertiesProps) {

    const pipeline = useSelector((p:any)=>p.pipelineEditor.value);
    const dispatch = useDispatch();
    const [groupFields, setGroupFields] = useState(props.task.compute.template.groupfields || []);
    const firstAggregation = props.task.compute.template.aggregationfields[0] || {name:'',aggregation:'',alias:''};
    const [aggregateName, setAggregateName] = useState(firstAggregation.name);
    const [aggregrateFunction, setAggregrateFunction] = useState(firstAggregation.aggregation);
    const [aliasName, setAliasName] = useState(firstAggregation.alias);

    function groupByFieldsChange(ev) {
        const groupValue = ev.map(o=>{
            return {
                name:o.value
            }
        })
        setGroupFields(groupValue);
    }

    function aggregateNameChange(ev) {
        setAggregateName(ev.value);
    }

    function aggregateFunctionChange(ev) {
        setAggregrateFunction(ev.value);
    }

    function aliasChange(ev) {
        setAliasName(ev.target.value);
    }

    function saveChanges() {
        dispatch(setTaskProperty({
            task:props.task,
            value:groupFields,
            path:'compute.template.groupfields'
        }));

        let aggregation = [...props.task.compute.template.aggregationfields];
        if (!aggregation.length) {
            aggregation = [{}]
        }
        aggregation[0] = {...aggregation[0]}
        aggregation[0].name=aggregateName;
        aggregation[0].aggregation=aggregrateFunction;
        aggregation[0].alias=aliasName;
        

        dispatch(setTaskProperty({
            task:props.task,
            value:aggregation,
            path:'compute.template.aggregationfields'
        }));
    }

    function discardChanges() {
        setGroupFields(props.task.compute.template.groupfields || []);
        setAggregateName(firstAggregation.name);
        setAggregrateFunction(firstAggregation.aggregation);
        setAliasName(firstAggregation.alias);
    }

    const aggregateOptions = [
        {value:'avg',label:'Average'},
        {value:'sum',label:'Sum'},
        {value:'count',label:'Count'},
        {value:'min',label:'Min'},
        {value:'max',label:'Max'},
        {value:'var',label:'Variance'},
        {value:'stdev',label:'St. Dev.'},
    ];

    const fieldOptions = taskHelper.getFieldsForTask(pipeline, props.task.taskid).map(f=>{
        return {
            label: f.name,
            value: f.name,
        }
    });

    const groupByValue = fieldOptions.filter(fo=>groupFields.some(gf=>gf.name === fo.value));
    const aggregateNameValue = fieldOptions.find(fo=>fo.value === aggregateName);
    const aggregateFunctionValue = aggregateOptions.find(fo=>fo.value === aggregrateFunction);
    
    return (<div className="group-by-properties-container">
        <div className="group-by-section-wrapper">
            <label className="group-by-section-wrapper-label">Field to group by</label>
            <div className="group-by-field-label">Choose source field(s)</div>
            <div className="group-by-select">
                <Select options={fieldOptions} isMulti={true} onChange={groupByFieldsChange} value={groupByValue}></Select>
            </div>
            <div className="group-by-field-label">Label this output column <span className="group-by-optional">(optional)</span></div>
            <div className="group-by-select">
                <TextField placeholder={"Output field label"} className='group-by-output-field-column' variant={'outlined'} size='small'/>
            </div>
        </div>

        <div className="group-by-aggregation-section-wrapper">
            <label className="group-by-section-wrapper-label">Data options</label>
            <div className="group-by-field-label">Choose source to populate the Pivot output</div>
            <div className="group-by-select">
                <Select options={fieldOptions} onChange={aggregateNameChange} value={aggregateNameValue} />
            </div>
            <div className="group-by-field-label">Choose a function to summarize the data</div>
            <div className="group-by-select">
                <Select options={aggregateOptions} onChange={aggregateFunctionChange} value={aggregateFunctionValue} />
            </div>
            <div className="group-by-field-label">Label this output column <span className="group-by-optional">(optional)</span></div>
            <div className="group-by-select">
                <TextField placeholder={"Output field label"} className='group-by-output-field-column' variant={'outlined'} size='small' value={aliasName} onChange={aliasChange}/>
            </div>
        </div>

        <div className="group-by-button-bar"><Button variant="contained" className="group-by-save-button" onClick={saveChanges}>Save Changes</Button><Button variant="outlined" className="group-by-discard-button" onClick={discardChanges}>Discard Changes</Button></div>
    </div>)
}