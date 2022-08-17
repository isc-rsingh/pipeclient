import {createSlice} from '@reduxjs/toolkit';
import { Pipeline } from '../models/pipeline';

const pipelineData: Pipeline = {
    "pipelineid": "FECA6560-ED26-11EC-8DAF-F4D488652FDC",
    "metadata": {"created":"66202,14742.28642", "modified":"66202,14742.28642","creator":"UnknownUser"},
    "tasks": [
        {
            "taskid": "85D0E4D0-ED27-11EC-8DAE-F4D488652FDC",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal"
            },
            "sink": {
                "type": "iris|table",
                "name": "RSPIPELINE.XYZ",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
        {
            "taskid": "CAF03F60-ED28-11EC-8DAF-F4D488652FDC",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal"
            },
            "sink": {
                "type": "iris|table",
                "name": "RSPIPELINE.XYZLOOKUP",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
        {
            "taskid": "32D44690-ED28-11EC-8DB0-F4D488652FDC",
            "pipelineids": ["FECA6560-ED26-11EC-8DAF-F4D488652FDC"],
            "source": {
                "type": "internal",
                "tasks": ["85D0E4D0-ED27-11EC-8DAE-F4D488652FDC"]
            },
            "type": "rs.pipeline.TaskFieldCompute",
            "compute": {
                "template": {
                    "inputsource": {
                        "name": "RSPIPELINE.XYZ",
                        "taskid": "85D0E4D0-ED27-11EC-8DAE-F4D488652FDC"
                    },
                    "targetfield": "totalincome",
                    "fields": ["loan_ID", "gender", "married", "dependents", "education", "self_employed", "applicantincome", "coapplicantincome", "loanAmount", "loan_amount_term", "credit_history", "property_area", "loan_status"]
                },
                "operation": "applicantincome + coapplicantincome"
            },
            "sink": {
                "type": "iris|view",
                "name": "RSPIPELINE.xyztotinc",
                "namespace": "USER"
            },
            "metadata": {"created":"66202,14742.28642","modified":"66202,14742.28642","creator":"UnknownUser"}
        },
   ]
  };


  export const pipelineEditorSlice = createSlice({
    name:'pipelineeditor',
    initialState:{value:pipelineData},
    reducers:{
        setPipeline: (state,action) => {
            state.value=action.payload;
        }
    }
  });

  export const { setPipeline } = pipelineEditorSlice.actions;

  export default pipelineEditorSlice.reducer;