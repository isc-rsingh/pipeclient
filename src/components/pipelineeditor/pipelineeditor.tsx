import React, { Component } from 'react';
import { Pipeline } from '../../models/pipeline';

import './pipelineeditor.css';
import createEngine, { 
    DefaultLinkModel, 
    DefaultNodeModel,
    DefaultPortModel,
    DiagramModel 
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';

class PipelineEditor extends Component<{pipelineData:Pipeline}> {
    
    render(): React.ReactNode {
        const engine = createEngine();
        const model = new DiagramModel();
        const p = this.props.pipelineData;

        if (p.tasks) {
            let nodeMap:any={};

            let x = 100;
            p.tasks.forEach(t => {
                const node = new DefaultNodeModel({
                    name:t.taskid,
                    color: 'rgb(0,192,255)',
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
                            const outPort = nodeMap[st].addPort(
                                new DefaultPortModel({
                                    in:false,
                                    name:'Out to ' + t.taskid,
                                    label: 'Out to ' + t.taskid,
                                }));
                            const inPort = nodeMap[t.taskid||''].addInPort('In to ' + t.taskid);
                            const link = new DefaultLinkModel();
                            link.setSourcePort(inPort);
                            link.setTargetPort(outPort);
                            model.addLink(link);
                        }
                    });
                }
            });

            for (const [taskId,nodeAny] of Object.entries(nodeMap)) {
                let node:DefaultNodeModel = nodeAny as DefaultNodeModel;
                if (!node.getOutPorts().length) {
                    const outPort = node.addOutPort('Out');
                    
                }
            }
        }

        engine.setModel(model);
        return (
            <div className='pipeline-editor-container'>
                <CanvasWidget engine={engine} className="canvas-widget"/>
            </div>
        )
    }
}

export default PipelineEditor;