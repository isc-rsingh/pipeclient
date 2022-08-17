import React from 'react';
import './pipelineoperations.css';
import {api, baseURL} from '../../services/api';
import {setPipeline} from '../../stores/pipeline-editor-store';
import { useDispatch } from 'react-redux';
function PipelineOperations(): JSX.Element  {

    const dispatch = useDispatch();

    function newPipeline() {
        api.createEmptyPipeline().then(p=>{
            dispatch(setPipeline(p));
        });
    }

    return (
        <div className='task-type-item' onClick={()=>newPipeline()}>
            <img src={baseURL + '/csp/user/pipes/icons/taskdropcolumns.svg'} className='task-type-icon' alt=""></img>
            <span className='task-type-text'>New pipeline</span>
        </div>
    );
}

export default PipelineOperations;