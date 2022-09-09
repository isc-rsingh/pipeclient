import { useSelector } from "react-redux";
import Select from "react-select";
import { Pipeline } from "../../models/pipeline";
import { name } from "../../services/name";

import './inputsourceinput.css';

export interface InputSourceInputProps {
    onInputChanged:(inputSource:string)=>void;
}

function InputSourceInput(props:InputSourceInputProps):JSX.Element {
    const p:Pipeline = useSelector((state:any)=>state.pipelineEditor.value);
    const opts = p.tasks.map((t)=>{
        return {value:t.taskid, label:name.getTaskName(t)}});

    

    return (<div className="input-source-input-container">
        <Select options={opts} isMulti={true}></Select>
    </div>);
}

export default InputSourceInput;