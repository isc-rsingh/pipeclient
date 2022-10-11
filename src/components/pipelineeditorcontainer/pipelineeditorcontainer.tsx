import { Component } from "react";
import { connect } from "react-redux";
import { hideDataPreviewPanel, hideRecipePropertiesPanel, removeFullscreenPipelineEditor, showDataPreviewPanel, showFullscreenPipelineEditor, showRecipePropertiesPanel } from "../../stores/ui-state-store";
import { api } from "../../services/api";
import PipelineEditor from "../pipelineeditor/pipelineeditor";
import { useParams } from "react-router-dom";
import SplitterLayout from 'react-splitter-layout';
import { setPipeline } from "../../stores/pipeline-editor-store";

import { ReactComponent as PipelineIcon } from "../../assets/icons/type_pipeline.svg";
import { ReactComponent as Fullscreen } from "../../assets/icons/type_fullscreen.svg";
import { ReactComponent as FullscreenExit } from "../../assets/icons/type_fullscreen_exit.svg";

import './pipelineeditorcontainer.css';
import 'react-splitter-layout/lib/index.css';
import RecipeEditor from "../recipeeditor/recipeeditor";

export interface PipelineEditorContainerProps {
  hideDataPreviewPanel:(payload:any)=>void;
  hideRecipePropertiesPanel:(payload:any)=>void;
  showDataPreviewPanel:(payload:any)=>void;
  showRecipePropertiesPanel:(payload:any)=>void;
  setPipeline:(payload:any)=>void;
  showFullscreenPipelineEditor:(payload:any)=>void;
  removeFullscreenPipelineEditor:(payload:any)=>void;
  showDataPreview:boolean;
  showTaskProperties:boolean;
  fullscreenPipelineEditor: boolean;
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

    closeTaskProperties() {
        this.props.hideRecipePropertiesPanel({});
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

          components = (
            <SplitterLayout vertical={true} percentage={true} secondaryInitialSize={80}>
                {components}
                <div className='pipeline-editor-inner-wrapper'>
                  <RecipeEditor />
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
    showRecipePropertiesPanel:(payload) => dispatch(showRecipePropertiesPanel(payload)),
    hideRecipePropertiesPanel:(payload) => dispatch(hideRecipePropertiesPanel(payload)),
    showDataPreviewPanel:(payload) => dispatch(showDataPreviewPanel(payload)),
    hideDataPreviewPanel:(payload) => dispatch(hideDataPreviewPanel(payload)),
    showFullscreenPipelineEditor: (payload) => dispatch(showFullscreenPipelineEditor(payload)),
    removeFullscreenPipelineEditor: (payload) => dispatch(removeFullscreenPipelineEditor(payload)),
    setPipeline:(payload) => dispatch(setPipeline(payload)),
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    showRecipePropertiesPanel: state.uiState.value.showRecipePropertiesPanel,
    showDataPreview: state.uiState.value.showDataPreviewPanel,
    previewData: state.uiState.value.previewData,
    fullscreenPipelineEditor: state.uiState.value.fullscreenPipelineEditor,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withParams(PipelineEditorContainer));
