import { BaseModelOptions } from '@projectstorm/react-canvas-core';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { Task } from '../../models/task';
import { TaskLinkModel } from "./TaskLinkModel";
import { TaskPortModel } from "./TaskPortModel";


export interface TaskNodeModelOptions extends BaseModelOptions {
	task?: Task;
}

export class TaskNodeModel extends DefaultNodeModel {
	task?: Task;

	constructor(options: TaskNodeModelOptions = {}) {
		super({
			...options,
			type: 'task-custom-node'
		});
		this.task = options.task;

		// setup an in and out port
		this.addPort(
			new TaskPortModel({
				in: true,
				name: 'in',
				extras: {
					taskid: this.task.taskid
				}
			})
		);
		this.addPort(
			new TaskPortModel({
				in: false,
				name: 'out',
				extras: {
					taskid: this.task.taskid
				}
			})
		);
	}

	serialize() {
		return {
			...super.serialize(),
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
	}

	addSource(source: TaskNodeModel): TaskLinkModel {
		const inPort = source.getPort('in');
		const outPort = this.getPort('out');
		const link = new TaskLinkModel({
			sourceTaskId: source.task.taskid || '',
			targetTaskId: this.task.taskid || ''
		});
		link.getOptions().color = '#cbcbcb';
		link.setSourcePort(outPort);
		link.setTargetPort(inPort);

		return link;
	}
}
