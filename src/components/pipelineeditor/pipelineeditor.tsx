import { useSelector } from 'react-redux';

import './pipelineeditor.css';
import createEngine, { 
    DiagramModel, RightAngleLinkFactory 
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
import { TaskNodeFactory, TaskNodeModel } from '../diagram/TaskNode';
import { Task } from '../../models/task';
import { useDrop } from 'react-dnd';
import { DragItemTypes } from '../../services/dragitemtypes';
import { api } from '../../services/api';
import { ITaskType } from '../../models/tasktype';
import { ArrowLinkFactory } from '../diagram/TaskLinkWidget';

const engine = createEngine();
engine.getNodeFactories().registerFactory(new TaskNodeFactory());
engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
//engine.getLinkFactories().registerFactory(new RightAngleLinkFactory());
let model = new DiagramModel();

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
        this.dependencies.push(layoutItem)
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

function getName(task:Task, taskTypes:ITaskType[]): string{
    const ttype = taskTypes.find(x=>x.type==task.type||'');
    return ttype?.name || task.sink.name;
}

function PipelineEditor() {
    let x,y;

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: DragItemTypes.TaskType,
            drop: (itm:any,monitor) => {
                const pos = monitor.getClientOffset();
                const node = new TaskNodeModel({
                    title: itm.name,
                    color: 'rgb(0,192,255)',
                    taskid: itm.name
                });
                node.setPosition(pos?.x || 0, pos?.y || 0);
                let m = model.clone();
                m.addNode(node);
                engine.setModel(m);
            },
            collect: (monitor) => ({
            isOver: !!monitor.isOver()
            })
        }),
    [x, y]
    );
    
    const p = useSelector((state:any)=>state.pipelineEditor.value);

    api.getAllTaskTypes().then(tt=>{
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
            
            const addNodeAtPosition = (li:LayoutMapItem,x:number,y:number): TaskNodeModel => {
                const node = new TaskNodeModel({
                    title:getName(li.task,tt),
                    color: 'rgb(0,192,255)',
                    taskid: li.task.taskid
                });

                node.setPosition(x,y);
                nodeMap[li.task.taskid||''] = node;
                model.addNode(node);

                li.dependencies.forEach((child:LayoutMapItem,idx:number)=>{
                    addNodeAtPosition(child,x+150,y+(idx*100));
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
        }
    });

    engine.setModel(model);

    return (
        <div className='pipeline-editor-container' ref={drop}>
            <CanvasWidget engine={engine} className="canvas-widget"/>
        </div>
    )

}
export default PipelineEditor;