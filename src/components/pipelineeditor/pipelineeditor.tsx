import { useSelector } from 'react-redux';

import './pipelineeditor.css';
import createEngine, { 
    DiagramModel 
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
import { useDispatch } from 'react-redux';
import { TaskLinkFactory } from '../diagram/TaskLinkFactory';
import { TaskLinkModel } from "../diagram/TaskLinkModel";
import { TaskNodeModelOptions } from "../diagram/TaskNodeModel";
import { TaskNodeModel } from "../diagram/TaskNodeModel";
import { TaskNodeFactory } from "../diagram/TaskNodeFactory";
import { Task } from '../../models/task';
import { DragItemTypes } from '../../services/dragitemtypes';
import { api } from '../../services/api';
import { createTemplate, TaskTypes } from '../../services/taskTypeHelper';
import { addTask, connectSourceToTarget,setTaskPosition, disconnectSourceFromTarget, addExistingTask, removeTaskFromPipeline, setTaskMetadataProperties } from '../../stores/pipeline-editor-store';
import { Pipeline } from '../../models/pipeline';
import { debounce } from '../../services/debounce';
import PipelineEditorMenu, { menuButton } from '../pipelineeditormenu/pipelineeditormenu';
import { useState } from 'react';
import { NameDialog } from '../nameDialog/nameDialog';
import { IUiState, removeFullscreenPipelineEditor, setSelectedTaskId, showRecipePropertiesPanel } from '../../stores/ui-state-store';

const engine = createEngine();
engine.getNodeFactories().registerFactory(new TaskNodeFactory());
engine.getLinkFactories().registerFactory(new TaskLinkFactory());

let initialLayoutRunning = false;

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

let posX;
let posY;
let draggedItemType;

function PipelineEditor(props) {

    let model = new DiagramModel();
    
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
                            
                            const sourceTask = p.taskCopies.find(t=>t.taskid === sourcePort.getOptions().extras?.taskid) as Task;
                            if (!sourceTask || sourceTask.type !== TaskTypes.TaskRecipe) {
                                return;
                            }

                            const lastTaskIdInRecipe = sourceTask.source.tasks.at(-1);
                            const lastTaskInRecipe = p.taskCopies.find(t=>t.taskid === lastTaskIdInRecipe) as Task;
                            const targetTask = p.taskCopies.find(t=>t.taskid === targetPort.getOptions().extras?.taskid) as Task;

                            if (lastTaskInRecipe && lastTaskInRecipe.metadata.properties) {
                                dispatch(setTaskMetadataProperties({
                                    taskid: targetTask.taskid,
                                    properties: lastTaskInRecipe.metadata.properties
                                }));
                            }
                            
                            const firstTaskInTargetRecipeId = targetTask.source.tasks.find(tid=>{
                                const investigateTask = p.taskCopies.find(it=>it.taskid===tid) as Task;
                                if (investigateTask?.type !== TaskTypes.TaskRecipe) {
                                    return true;
                                }
                                return null;
                            });
                            
                            const firstTaskInTargetRecipe = p.taskCopies.find(t=>t.taskid===firstTaskInTargetRecipeId);
                            if (firstTaskInTargetRecipe) {
                                dispatch(setTaskMetadataProperties({
                                    taskid: firstTaskInTargetRecipe.taskid,
                                    properties: lastTaskInRecipe.metadata.properties
                                }));
                            }
                        }
                    }
                });
            } else {
                let dfLink = event.link as TaskLinkModel;
                dispatch(disconnectSourceFromTarget({
                    source:dfLink.sourceTaskId,
                    target:dfLink.targetTaskId,
                }));
            }
        },
        nodesUpdated: (evt) => {
            if (!initialLayoutRunning && !evt.isCreated) {
                dispatch(removeTaskFromPipeline((evt.node.getOptions() as TaskNodeModelOptions).task.taskid));
            }
        }
    });
    
    const p = useSelector((state:any)=>state.pipelineEditor.value) as Pipeline;
    const uiState:IUiState = useSelector((state:any)=>state.uiState.value);

    const dispatch = useDispatch();
    const [openNameDialog, setOpenNameDialog]=useState(false);

    function allowDrop(ev) {
        if (ev.dataTransfer.types.includes(DragItemTypes.TaskType) || ev.dataTransfer.types.includes(DragItemTypes.Task)) {
            console.log('prevent');
            ev.preventDefault();
        }
    }

    function drop(ev) {
        const itemType = ev.dataTransfer.getData(DragItemTypes.TaskType);
        if (itemType) {
            posX = ev.clientX;
            posY = ev.clientY;
            draggedItemType = itemType;
            setOpenNameDialog(true);
        } else {
            const taskid = ev.dataTransfer.getData(DragItemTypes.Task);
            api.getTask(taskid).then((t)=>{
                dispatch(addExistingTask(t));
            });
        }
    }

    async function newTaskNamed(taskName: string) {
        setOpenNameDialog(false);
        
        if (taskName) {
            const newTaskSkeleton = await api.createEmptyTask(draggedItemType, p.pipelineid, taskName);
            newTaskSkeleton.type = draggedItemType;
            
            const newTask = await createTemplate(newTaskSkeleton,p.pipelineid );
            dispatch(addTask(newTask));

            const recipeTask = await api.createRecipeForTask(p.pipelineid, newTask.taskid, taskName);
            dispatch(setTaskPosition({ taskid: recipeTask.taskid, x:posX, y:posY}));
            dispatch(addTask(recipeTask));
        }
    }

    function runPipeline() {
        api.runPipeline(p.pipelineid);
    }

    function taskIsRoot(t:Task):boolean {
        if (t.type !== TaskTypes.TaskRecipe) {
            return false;
        }

        return !t.source.tasks.every(x=>p.taskCopies.find(tc=>tc.taskid === x)?.type===TaskTypes.TaskRecipe);
    }

    function taskIsDrawable(t:Task): boolean {
        return (t.type === TaskTypes.TaskRecipe);
    }

    if (p && p.taskCopies) {
        const layoutItems:{[name:string]: LayoutMapItem}={};
        p.taskCopies.forEach((t:Task)=>{
            layoutItems[t.taskid]=(new LayoutMapItem(t));
        });

        const rootLayoutItems:LayoutMapItem[] = [];
        p.taskCopies.filter((t:Task)=>taskIsRoot(t)).forEach((t:Task)=>{
            const layoutItem = layoutItems[t.taskid];
            rootLayoutItems.push(layoutItem);
        });

        p.taskCopies.filter((tc:Task)=>taskIsDrawable(tc)).forEach((t:Task)=>{
            if (t.source?.tasks?.length) {
                t?.source?.tasks.forEach(st=>{
                    if (p.taskCopies.find(tc=>tc.taskid === st)?.type===TaskTypes.TaskRecipe) {
                        layoutItems[t.taskid].addParent(layoutItems[st]);
                        layoutItems[st].addDependencies(layoutItems[t.taskid]);
                    }
                });
            }
        });

        let nodeMap:{[name:string]:TaskNodeModel}= {};
        let debouncePositionByTask = {};
        
        initialLayoutRunning = true;

        const addNodeAtPosition = (li:LayoutMapItem,x:number,y:number): TaskNodeModel => {
            const node = new TaskNodeModel({
                task: li.task
            });

            debouncePositionByTask[li.task.taskid] = debouncePositionByTask[li.task.taskid] || debounce((posX:number, posY:number)=>{
                dispatch(setTaskPosition({ taskid: li.task.taskid, x:posX, y:posY}));
            },500);
            
            node.registerListener({
                positionChanged:(event)=>{
                    if (initialLayoutRunning) return;
                    const pos = event.entity.getPosition();
                    debouncePositionByTask[li.task.taskid](pos.x,pos.y);
                },
                selectionChanged(event) {
                    if (event.isSelected) {
                        const mdl = event.entity as TaskNodeModel;
                        dispatch(setSelectedTaskId(mdl.task.taskid));
                    }
                },
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

    function handleMenuPressed(button:menuButton, args?) {
        switch (button) {
            case menuButton.taskProperties:
                const selectedNode = model.getNodes().find(x=>x.getOptions().selected);
                if (selectedNode) {
                    if (uiState.fullscreenPipelineEditor) {
                        dispatch(removeFullscreenPipelineEditor({}))
                    }
                    dispatch(showRecipePropertiesPanel({}));
                }
                break;
            case menuButton.newTask:
                posX=150; //TODO: Determine where to place new task.
                posY=150;
                draggedItemType = args;
                setOpenNameDialog(true);
                break;
            case menuButton.runPipeline:
                runPipeline();
                break;
        }
    }

    return (
        <div className='pipeline-editor' onDrop={drop} onDragOver={allowDrop}>
            { (!uiState.showRecipePropertiesPanel || uiState.fullscreenPipelineEditor)  && <PipelineEditorMenu menuPressed={handleMenuPressed} /> }
            <CanvasWidget engine={engine} className="canvas-widget"/>
            <NameDialog open={openNameDialog} title={'Task Name'} onClose={newTaskNamed} ></NameDialog>
        </div>
    )

}
export default PipelineEditor;