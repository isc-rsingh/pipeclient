import { Component } from "react";
import { connect } from "react-redux";
import { Task } from "../../models/task";
import { hideDataPreviewPanel, hideTaskPropertiesPanel, removeFullscreenPipelineEditor, showDataPreviewPanel, showFullscreenPipelineEditor, showTaskPropertiesPanel } from "../../stores/ui-state-store";
import { api } from "../../services/api";
import DataPreview from "../datapreview/datapreview";
import PipelineEditor from "../pipelineeditor/pipelineeditor";
import TaskProperties from "../taskproperties/taskproperties";
import { useParams } from "react-router-dom";
import SplitterLayout from 'react-splitter-layout';
import { setPipeline } from "../../stores/pipeline-editor-store";

import { ReactComponent as PipelineIcon } from "../../assets/icons/type_pipeline.svg";
import { ReactComponent as Fullscreen } from "../../assets/icons/type_fullscreen.svg";
import { ReactComponent as FullscreenExit } from "../../assets/icons/type_fullscreen_exit.svg";

import './pipelineeditorcontainer.css';
import 'react-splitter-layout/lib/index.css';

export interface PipelineEditorContainerProps {
  hideDataPreviewPanel:(payload:any)=>void;
  hideTaskPropertiesPanel:(payload:any)=>void;
  showDataPreviewPanel:(payload:any)=>void;
  showTaskPropertiesPanel:(payload:any)=>void;
  setPipeline:(payload:any)=>void;
  showFullscreenPipelineEditor:(payload:any)=>void;
  removeFullscreenPipelineEditor:(payload:any)=>void;
  showDataPreview:boolean;
  showTaskProperties:boolean;
  fullscreenPipelineEditor: boolean;
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

    showPipelineFullscreen() {
      this.props.showFullscreenPipelineEditor({});
    }

    removePipelineFullscreen() {
      this.props.removeFullscreenPipelineEditor({});
    }

    render() {

        let fullScreenIcon;
        if (this.props.fullscreenPipelineEditor) {
          fullScreenIcon = (<FullscreenExit className='pipeline-editor-icon icon-right' onClick={this.removePipelineFullscreen.bind(this)} />);
        } else {
          fullScreenIcon = (<Fullscreen className='pipeline-editor-icon icon-right' onClick={this.showPipelineFullscreen.bind(this)} />);
        }

        let components;
        components = (<div className="pipeline-editor-wrapper">
                          <div className="pipeline-editor-wrapper-header">
                              <PipelineIcon className='pipeline-editor-icon first-icon'/>
                              {fullScreenIcon}
                          </div>
                          <PipelineEditor></PipelineEditor>
                      </div>);

        if ((this.props.showDataPreview || this.props.showTaskProperties) && !this.props.fullscreenPipelineEditor) {
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

          components = (
            <SplitterLayout vertical={true} percentage={true} secondaryInitialSize={80}>
                {components}
                <div className={`pipeline-editor-inner-wrapper`}>
                  {taskproperties}
                  {datapreview}
                </div>
              </SplitterLayout>
          );
        }

        return (
            <section className='pipeline-editor-container'>
              {components}
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
    showFullscreenPipelineEditor: (payload) => dispatch(showFullscreenPipelineEditor(payload)),
    removeFullscreenPipelineEditor: (payload) => dispatch(removeFullscreenPipelineEditor(payload)),
    setPipeline:(payload) => dispatch(setPipeline(payload)),
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    showTaskProperties: state.uiState.value.showTaskPropertiesPanel,
    showDataPreview: state.uiState.value.showDataPreviewPanel,
    selectedTask: state.uiState.value.selectedTask,
    previewData: state.uiState.value.previewData,
    fullscreenPipelineEditor: state.uiState.value.fullscreenPipelineEditor,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withParams(PipelineEditorContainer));
