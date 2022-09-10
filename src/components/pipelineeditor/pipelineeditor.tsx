import { useSelector } from 'react-redux';

import './pipelineeditor.css';
import createEngine, { 
    DiagramModel 
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
import { useDispatch } from 'react-redux';
import { DfRightAngleLinkFactory } from '../diagram/DfRightAngleLinkFactory';
import { DfRightAngleLinkModel } from "../diagram/DfRightAngleLinkModel";
import { TaskNodeModel } from "../diagram/TaskNodeModel";
import { TaskNodeFactory } from "../diagram/TaskNodeFactory";
import { Task } from '../../models/task';
import { useDrop } from 'react-dnd';
import { DragItemTypes } from '../../services/dragitemtypes';
import { api } from '../../services/api';
import { createTemplate } from '../../services/taskTypeHelper';
import { addTask, connectSourceToTarget,setTaskPosition, disconnectSourceFromTarget } from '../../stores/pipeline-editor-store';
import { Pipeline } from '../../models/pipeline';
import { debounce } from '../../services/debounce';
import { useState } from 'react';

const engine = createEngine();
engine.getNodeFactories().registerFactory(new TaskNodeFactory());
engine.getLinkFactories().registerFactory(new DfRightAngleLinkFactory());

class LayoutMapItem {
    constructor(task: Task) {
        this.task = task;
    }

    parentItems: LayoutMapItem[]=[];
    task: Task
    dependencies: LayoutMapItem[]=[];
    allDependencyCount:number=0;

    addParent(layoutItem:LayoutMapItem) {
        this.parentItems.push(layoutItem);
    }

    addDependencies(layoutItem:LayoutMapItem) {
        this.dependencies.push(layoutItem);
        this.allDependencyCount += layoutItem.allDependencyCount;
        
        function updateAncestryCounts(parents: LayoutMapItem[] ) {
            parents.forEach(parent=>{
                parent.allDependencyCount += layoutItem.allDependencyCount;
                if (parent.parentItems.length) {
                    updateAncestryCounts(parent.parentItems);
                }
            });
        }
        updateAncestryCounts(this.parentItems);
    }
}

function getPosition(taskid:string, pipeline:Pipeline,proposedX:number, proposedY: number) :{x:number,y:number, record:boolean} {
    let rslt;
    if (!pipeline.metadata.position) {
        rslt = { x:proposedX, y:proposedY, record:true }
    } else if (!pipeline.metadata.position[taskid]) {
        rslt = { x:proposedX, y:proposedY, record:true }
    } else {
        rslt = {...pipeline.metadata.position[taskid], record: false};
    }

    return rslt;
}

export interface IPipelineEditorProps {
    onTaskSelected:(selectedTask: Task) => void,
}

function PipelineEditor(props:IPipelineEditorProps) {

    const {onTaskSelected} = props;

    let x,y;
    let model = new DiagramModel();
    const [state, setState] = useState({selectedTask:null});

    model.registerListener({
        linksUpdated: (event) => {
            if (event.isCreated) {
                event.link.registerListener({
                targetPortChanged: (event) => {
                        const sourcePort = event.entity.getSourcePort();
                        const targetPort = event.entity.getTargetPort();

                        if (sourcePort && targetPort) {
                            dispatch(connectSourceToTarget({
                                source:sourcePort.getOptions().extras?.taskid,
                                target:targetPort.getOptions().extras?.taskid, 
                            }));
                        }
                    }
                });
            } else {
                let dfLink = event.link as DfRightAngleLinkModel;
                dispatch(disconnectSourceFromTarget({
                    source:dfLink.sourceTaskId,
                    target:dfLink.targetTaskId,
                }));
            }
        },
    });
    
    const p = useSelector((state:any)=>state.pipelineEditor.value);
    const dispatch = useDispatch();

    const [, drop] = useDrop(
        () => ({
            accept: DragItemTypes.TaskType,
            drop: (itm:any,monitor) => {
                const pos = monitor.getClientOffset();
                api.createEmptyTask(itm.type).then((newTaskSkeleton)=>{
                    newTaskSkeleton.type = itm.type;
                    createTemplate(newTaskSkeleton,p.id).then((newTask)=>{
                        dispatch(addTask(newTask));
                        dispatch(setTaskPosition({ taskid: newTask.taskid, x:pos?.x, y:pos?.y}));
                    });
                })
            },
            collect: (monitor) => ({
            isOver: !!monitor.isOver()
            })
        }),
    [x, y]
    );

    if (p.tasks) {
        const layoutItems:{[name:string]: LayoutMapItem}={};
        p.tasks.forEach((t:Task)=>{
            layoutItems[t.taskid]=(new LayoutMapItem(t));
        });

        const rootLayoutItems:LayoutMapItem[] = [];
        p.tasks.filter(t=>!(t.source?.tasks?.length)).forEach((t:Task)=>{
            const layoutItem = layoutItems[t.taskid];
            rootLayoutItems.push(layoutItem);
        });

        p.tasks.forEach((t:Task)=>{
            if (t.source?.tasks?.length) {
                t?.source?.tasks.forEach(st=>{
                    layoutItems[t.taskid].addParent(layoutItems[st]);
                    layoutItems[st].addDependencies(layoutItems[t.taskid]);
                });
            }
        });

        let nodeMap:{[name:string]:TaskNodeModel}= {};
        let initialLayoutRunning = true;
        let debouncePositionByTask = {};

        const addNodeAtPosition = (li:LayoutMapItem,x:number,y:number): TaskNodeModel => {
            const node = new TaskNodeModel({
                color: 'rgb(0,192,255)',
                task: li.task
            });

            if (li.task.taskid === state.selectedTask) {
                node.setSelected(true);
            }

            debouncePositionByTask[li.task.taskid] = debouncePositionByTask[li.task.taskid] || debounce((posX:number, posY:number)=>{
                dispatch(setTaskPosition({ taskid: li.task.taskid, x:posX, y:posY}));
            },500);
            
            node.registerListener({
                positionChanged:(event)=>{
                    if (initialLayoutRunning) return;
                    const pos = event.entity.getPosition();
                    debouncePositionByTask[li.task.taskid](pos.x,pos.y);
                },
                selectionChanged:(event)=> {
                    if (event.isSelected) {
                        setState({selectedTask:li.task.taskid});
                        if (onTaskSelected) onTaskSelected(li.task);
                    }
                }
            })

            const position = getPosition(li.task.taskid, p, x, y);
            node.setPosition(position.x,position.y);
            if (position.record) {
                dispatch(setTaskPosition({x:position.x,y:position.y, taskid:li.task.taskid}))
            }

            nodeMap[li.task.taskid||''] = node;
            model.addNode(node);

            li.dependencies.forEach((child:LayoutMapItem,idx:number)=>{
                addNodeAtPosition(child,x+250,y+(idx*100));
                const link = nodeMap[li.task.taskid].addSource(nodeMap[child.task.taskid]);
                model.addLink(link);
            });

            return node;
        };

        let rootY = 100;
        rootLayoutItems.forEach((li)=>{
            addNodeAtPosition(li,100,rootY);
            rootY += (100*(li.allDependencyCount + 2));
        });
        initialLayoutRunning = false;
    }
    

    engine.setModel(model);

    return (
        <div className='pipeline-editor' ref={drop}>
            <CanvasWidget engine={engine} className="canvas-widget"/>
        </div>
    )

}
export default PipelineEditor;