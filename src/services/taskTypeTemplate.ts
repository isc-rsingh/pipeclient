import { Task } from "../models/task";

export async function createTemplate(taskType:string, pipelineId:string) {
    const taskId = crypto.randomUUID();
    const rslt:Task = {
        "taskid": taskId,
        "pipelineids": [pipelineId],
        "type": taskType,
        "source": {
            "type": "internal"
        },
        "compute": {
            "template": {
                "outputfields": ["b","c"],
                "filter": "a IS NOT NULL AND a > 0"
            }
        },
        "sink": {
            "type": "iris|table",
            "name": "RSPIPELINE.XYZ",
            "namespace": "USER"
        },
        "metadata": {
        }
    };

    return Promise.resolve(rslt);
}