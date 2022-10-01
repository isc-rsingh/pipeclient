import { Component } from "react";
import { connect } from "react-redux";
import { Task } from "../../models/task";
import { hideDataPreviewPanel, hideTaskPropertiesPanel, showDataPreviewPanel, showTaskPropertiesPanel } from "../../stores/ui-state-store";
import { api } from "../../services/api";
import DataPreview from "../datapreview/datapreview";
import PipelineEditor from "../pipelineeditor/pipelineeditor";
import TaskProperties from "../taskproperties/taskproperties";
import { useParams } from "react-router-dom";

import './pipelineeditorcontainer.css';
import { setPipeline } from "../../stores/pipeline-editor-store";

export interface PipelineEditorContainerProps {
  hideDataPreviewPanel:(payload:any)=>void;
  hideTaskPropertiesPanel:(payload:any)=>void;
  showDataPreviewPanel:(payload:any)=>void;
  showTaskPropertiesPanel:(payload:any)=>void;
  setPipeline:(payload:any)=>void;
  showDataPreview:boolean;
  showTaskProperties:boolean;
  selectedTask: Task | null;
  previewData:any[];
  params:any;
}

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class PipelineEditorContainer extends Component<PipelineEditorContainerProps> {

    componentDidMount() {
      const {pipelineid } = this.props.params;
      this.loadPipeline(pipelineid);
    }

    state = {
        selectedTask:null
    }

    closeTaskProperties() {
        this.props.hideTaskPropertiesPanel({});
    }

    loadPipeline(pipelineId) {
        api.getPipeline(pipelineId).then((p)=>{
            this.props.setPipeline(p);
        });
    }

    render() {

        let taskproperties;
        if (this.props.showTaskProperties) {
            taskproperties = (<div className="task-properties-wrapper">
                <TaskProperties task={this.props.selectedTask} onClose={this.closeTaskProperties.bind(this)}/>
            </div>);
        }

        let datapreview;
        if (this.props.showDataPreview) {
            datapreview = (<div className="data-preview-wrapper">
                <DataPreview data={this.props.previewData}/>
            </div> );
        }
        return (
            <section className={`pipeline-editor-container ${this.props.showTaskProperties && 'show-task-properties'} ${this.props.showDataPreview && 'show-data-preview'}`}>
                {taskproperties}
                <div className="pipeline-editor-wrapper">
                    <PipelineEditor></PipelineEditor>
                </div>
                {datapreview}
            </section>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
  return {
    showTaskPropertiesPanel:(payload) => dispatch(showTaskPropertiesPanel(payload)),
    hideTaskPropertiesPanel:(payload) => dispatch(hideTaskPropertiesPanel(payload)),
    showDataPreviewPanel:(payload) => dispatch(showDataPreviewPanel(payload)),
    hideDataPreviewPanel:(payload) => dispatch(hideDataPreviewPanel(payload)),
    setPipeline:(payload) => dispatch(setPipeline(payload)),
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    showTaskProperties: state.uiState.value.showTaskPropertiesPanel,
    showDataPreview: state.uiState.value.showDataPreviewPanel,
    selectedTask: state.uiState.value.selectedTask,
    previewData: state.uiState.value.previewData,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withParams(PipelineEditorContainer));
