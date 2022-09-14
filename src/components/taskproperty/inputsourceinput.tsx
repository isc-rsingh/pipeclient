import { useDispatch, useSelector } from "react-redux";
import Select, { ActionMeta, OnChangeValue } from "react-select";

import { Pipeline } from "../../models/pipeline";
import { Task } from "../../models/task";
import { name } from "../../services/name";
import { getTaskInputCount } from "../../services/taskTypeHelper";
import { updateTaskInputSource } from "../../stores/pipeline-editor-store";

import './inputsourceinput.css';

export interface InputSourceInputProps {
    onInputChanged:(inputSource:string)=>void;
    task: Task;
}

type InputSourceOption = {label: string, value: number}

function InputSourceInput(props:InputSourceInputProps):JSX.Element {
    const {task} = props;

    const p:Pipeline = useSelector((state:any)=>state.pipelineEditor.value);
    const dispatch = useDispatch();
    
    const opts = p.tasks.map((t)=>{
        return {value:t.taskid, label:name.getTaskName(t)}});

    const isMulti = getTaskInputCount(task) !== 1;

    const selected = opts.filter(x=>task.source.tasks.includes(x.value));

    const onSingleChange = (tags: OnChangeValue<InputSourceOption, false>, actionMeta:ActionMeta<InputSourceOption>) => {
        if (tags) {
            dispatch(updateTaskInputSource({task, sourceTaskId:tags.value}))
        }
    }

    return (<div className="input-source-input-container">
        <Select options={opts} isMulti={isMulti} value={selected} onChange={onSingleChange}></Select>
    </div>);
}

export default InputSourceInput;