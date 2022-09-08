import { render } from "@testing-library/react";
import { Component } from "react";
import { Task } from "../../models/task";
import PipelineEditor from "../pipelineeditor/pipelineeditor";
import TaskProperties from "../taskproperties/taskproperties";

import './pipelineeditorcontainer.css';

class PipelineEditorContainer extends Component {

    state ={
        selectedTask:null
    }

    taskSelectedBind(selectedTask:Task) {
        this.setState({selectedTask});
    }

    taskSelected = this.taskSelectedBind.bind(this);

    render() {
        return (
            <section className={`pipeline-editor-container ${this.state.selectedTask && 'show-task-properties'}`}>
                <PipelineEditor onTaskSelected={this.taskSelected}></PipelineEditor>
                <TaskProperties task={this.state.selectedTask} />
            </section>
        )
    }
}

export default PipelineEditorContainer;