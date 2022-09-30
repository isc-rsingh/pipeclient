import { DiagramEngine } from '@projectstorm/react-diagrams';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import * as React from 'react';
import { TaskNodeModel } from "./TaskNodeModel";
import  TaskNodeWidget  from "./TaskNodeWidget";


export class TaskNodeFactory extends AbstractReactFactory<TaskNodeModel, DiagramEngine> {
	constructor() {
		super('task-custom-node');
	}

	generateModel(initialConfig: any) {
		return new TaskNodeModel();
	}

	generateReactWidget(event: any): JSX.Element {
		return <TaskNodeWidget engine={this.engine as DiagramEngine} node={event.model} task={event.model.task}/>;
	}
}
