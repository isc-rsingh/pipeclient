import { useSelector } from 'react-redux';

import './pipelineeditor.css';
import createEngine, { 
    DiagramModel 
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
import { TaskNodeFactory, TaskNodeModel } from '../diagram/TaskNode';
import { ArrowLinkFactory } from '../diagram/TaskLinkWidget';

function PipelineEditor() {
    const engine = createEngine();
    engine.getNodeFactories().registerFactory(new TaskNodeFactory());
    engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
    
    const model = new DiagramModel();
    
    const p = useSelector((state:any)=>state.pipelineEditor.value);

    if (p.tasks) {
        let nodeMap:any={};

        let x = 100;
        p.tasks.forEach(t => {
            const node = new TaskNodeModel({
                title:t.taskid,
                color: 'rgb(0,192,255)',
                taskid: t.taskid
            });
            node.setPosition(x,x);
            nodeMap[t.taskid||''] = node;
            model.addNode(node);

            x+=100;
        });

        p.tasks.forEach(t=>{
            if (t.source?.tasks?.length) {
                t.source.tasks.forEach(st=>{
                    if (nodeMap[st]) {
                        const link = nodeMap[st].addSource(nodeMap[t.taskid||'']);
                        model.addLink(link);
                    }
                });
            }
        });
    }

    engine.setModel(model);
    return (
        <div className='pipeline-editor-container'>
            <CanvasWidget engine={engine} className="canvas-widget"/>
        </div>
    )

}
export default PipelineEditor;