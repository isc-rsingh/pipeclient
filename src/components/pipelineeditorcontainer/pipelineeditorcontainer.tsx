import { Component } from "react";
import { connect } from "react-redux";
import { Task } from "../../models/task";
import { hideDataPreviewPanel, hideTaskPropertiesPanel, showDataPreviewPanel, showTaskPropertiesPanel } from "../../stores/ui-state-store";
import DataPreview from "../datapreview/datapreview";
import PipelineEditor from "../pipelineeditor/pipelineeditor";
import TaskProperties from "../taskproperties/taskproperties";

import './pipelineeditorcontainer.css';

export interface PipelineEditorContainerProps {
  hideDataPreviewPanel:(payload:any)=>void;
  hideTaskPropertiesPanel:(payload:any)=>void;
  showDataPreviewPanel:(payload:any)=>void;
  showTaskPropertiesPanel:(payload:any)=>void;
  showDataPreview:boolean;
  showTaskProperties:boolean;
}

class PipelineEditorContainer extends Component<PipelineEditorContainerProps> {

    sampledata ={
        "children": [
          {
            "loan_ID": "LP001002",
            "gender": "Male",
            "married": "No",
            "dependents": 0,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 5849,
            "coapplicantincome": 0,
            "loanAmount": "",
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001003",
            "gender": "Male",
            "married": "Yes",
            "dependents": 1,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 4583,
            "coapplicantincome": 1508,
            "loanAmount": 128,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Rural",
            "loan_status": "N"
          },
          {
            "loan_ID": "LP001005",
            "gender": "Male",
            "married": "Yes",
            "dependents": 0,
            "education": "Graduate",
            "self_employed": "Yes",
            "applicantincome": 3000,
            "coapplicantincome": 0,
            "loanAmount": 66,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001006",
            "gender": "Male",
            "married": "Yes",
            "dependents": 0,
            "education": "Not Graduate",
            "self_employed": "No",
            "applicantincome": 2583,
            "coapplicantincome": 2358,
            "loanAmount": 120,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001008",
            "gender": "Male",
            "married": "No",
            "dependents": 0,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 6000,
            "coapplicantincome": 0,
            "loanAmount": 141,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001011",
            "gender": "Male",
            "married": "Yes",
            "dependents": 2,
            "education": "Graduate",
            "self_employed": "Yes",
            "applicantincome": 5417,
            "coapplicantincome": 4196,
            "loanAmount": 267,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001013",
            "gender": "Male",
            "married": "Yes",
            "dependents": 0,
            "education": "Not Graduate",
            "self_employed": "No",
            "applicantincome": 2333,
            "coapplicantincome": 1516,
            "loanAmount": 95,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001018",
            "gender": "Male",
            "married": "Yes",
            "dependents": 2,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 4006,
            "coapplicantincome": 1526,
            "loanAmount": 168,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001020",
            "gender": "Male",
            "married": "Yes",
            "dependents": 1,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 12841,
            "coapplicantincome": 10968,
            "loanAmount": 349,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Semiurban",
            "loan_status": "N"
          },
          {
            "loan_ID": "LP001024",
            "gender": "Male",
            "married": "Yes",
            "dependents": 2,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 3200,
            "coapplicantincome": 700,
            "loanAmount": 70,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001027",
            "gender": "Male",
            "married": "Yes",
            "dependents": 2,
            "education": "Graduate",
            "self_employed": "",
            "applicantincome": 2500,
            "coapplicantincome": 1840,
            "loanAmount": 109,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001028",
            "gender": "Male",
            "married": "Yes",
            "dependents": 2,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 3073,
            "coapplicantincome": 8106,
            "loanAmount": 200,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001029",
            "gender": "Male",
            "married": "No",
            "dependents": 0,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 1853,
            "coapplicantincome": 2840,
            "loanAmount": 114,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Rural",
            "loan_status": "N"
          },
          {
            "loan_ID": "LP001030",
            "gender": "Male",
            "married": "Yes",
            "dependents": 2,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 1299,
            "coapplicantincome": 1086,
            "loanAmount": 17,
            "loan_amount_term": 120,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001032",
            "gender": "Male",
            "married": "No",
            "dependents": 0,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 4950,
            "coapplicantincome": 0,
            "loanAmount": 125,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001034",
            "gender": "Male",
            "married": "No",
            "dependents": 1,
            "education": "Not Graduate",
            "self_employed": "No",
            "applicantincome": 3596,
            "coapplicantincome": 0,
            "loanAmount": 100,
            "loan_amount_term": 240,
            "credit_history": "",
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001036",
            "gender": "Female",
            "married": "No",
            "dependents": 0,
            "education": "Graduate",
            "self_employed": "No",
            "applicantincome": 3510,
            "coapplicantincome": 0,
            "loanAmount": 76,
            "loan_amount_term": 360,
            "credit_history": 0,
            "property_area": "Urban",
            "loan_status": "N"
          },
          {
            "loan_ID": "LP001038",
            "gender": "Male",
            "married": "Yes",
            "dependents": 0,
            "education": "Not Graduate",
            "self_employed": "No",
            "applicantincome": 4887,
            "coapplicantincome": 0,
            "loanAmount": 133,
            "loan_amount_term": 360,
            "credit_history": 1,
            "property_area": "Rural",
            "loan_status": "N"
          },
          {
            "loan_ID": "LP001041",
            "gender": "Male",
            "married": "Yes",
            "dependents": 0,
            "education": "Graduate",
            "self_employed": "",
            "applicantincome": 2600,
            "coapplicantincome": 3500,
            "loanAmount": 115,
            "loan_amount_term": "",
            "credit_history": 1,
            "property_area": "Urban",
            "loan_status": "Y"
          },
          {
            "loan_ID": "LP001043",
            "gender": "Male",
            "married": "Yes",
            "dependents": 0,
            "education": "Not Graduate",
            "self_employed": "No",
            "applicantincome": 7660,
            "coapplicantincome": 0,
            "loanAmount": 104,
            "loan_amount_term": 360,
            "credit_history": 0,
            "property_area": "Urban",
            "loan_status": "N"
          }
        ]
      };

    state = {
        selectedTask:null
    }

    taskSelectedBind(selectedTask:Task) {
        this.props.showDataPreviewPanel({});
        this.props.showTaskPropertiesPanel({});
        this.setState({selectedTask});
    }

    taskSelected = this.taskSelectedBind.bind(this);

    closeTaskProperties() {
        this.props.hideTaskPropertiesPanel({});
    }

    render() {

        let taskproperties;
        if (this.props.showTaskProperties) {
            taskproperties = (<div className="task-properties-wrapper">
                <TaskProperties task={this.state.selectedTask} onClose={this.closeTaskProperties.bind(this)}/>
            </div>);
        }

        let datapreview;
        if (this.props.showDataPreview) {
            datapreview = (<div className="data-preview-wrapper">
                <DataPreview data={this.sampledata.children}/>
            </div> );
        }
        return (
            <section className={`pipeline-editor-container ${this.props.showTaskProperties && 'show-task-properties'} ${this.props.showDataPreview && 'show-data-preview'}`}>
                {taskproperties}
                <div className="pipeline-editor-wrapper">
                    <PipelineEditor onShowProperties={this.taskSelected}></PipelineEditor>
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
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    showTaskProperties: state.uiState.value.showTaskPropertiesPanel,
    showDataPreview: state.uiState.value.showDataPreviewPanel,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PipelineEditorContainer);