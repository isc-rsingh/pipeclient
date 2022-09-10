import { render } from "@testing-library/react";
import { Component } from "react";
import { Task } from "../../models/task";
import DataPreview from "../datapreview/datapreview";
import PipelineEditor from "../pipelineeditor/pipelineeditor";
import TaskProperties from "../taskproperties/taskproperties";

import './pipelineeditorcontainer.css';

class PipelineEditorContainer extends Component {

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
        selectedTask:null,
        showTaskProperties:false,
        showDataPreview:false,
    }

    taskSelectedBind(selectedTask:Task) {
        this.setState({selectedTask, showTaskProperties:true, showDataPreview:true});
    }

    taskSelected = this.taskSelectedBind.bind(this);

    closeTaskProperties() {
        this.setState({showTaskProperties:false});
    }

    render() {

        let taskproperties;
        if (this.state.showTaskProperties) {
            taskproperties = (<div className="task-properties-wrapper">
                <TaskProperties task={this.state.selectedTask} onClose={this.closeTaskProperties.bind(this)}/>
            </div>);
        }

        let datapreview;
        if (this.state.showDataPreview) {
            datapreview = (<div className="data-preview-wrapper">
                <DataPreview data={this.sampledata.children}/>
            </div> );
        }
        return (
            <section className={`pipeline-editor-container ${this.state.showTaskProperties && 'show-task-properties'} ${this.state.showDataPreview && 'show-data-preview'}`}>
                {taskproperties}
                <div className="pipeline-editor-wrapper">
                    <PipelineEditor onTaskSelected={this.taskSelected}></PipelineEditor>
                </div>
                {datapreview}
            </section>
        )
    }
}

export default PipelineEditorContainer;