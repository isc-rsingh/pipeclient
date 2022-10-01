import { BaseModelOptions } from '@projectstorm/react-canvas-core';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { Task } from '../../models/task';
import { DfRightAngleLinkModel } from "./DfRightAngleLinkModel";
import { DfRightAnglePortModel } from "./DfRightAnglePortModel";


export interface TaskNodeModelOptions extends BaseModelOptions {
	color?: string;
	title?: string;
	task?: Task;
}

export class TaskNodeModel extends DefaultNodeModel {
	color: string;
	title: string;
	task?: Task;

	constructor(options: TaskNodeModelOptions = {}) {
		super({
			...options,
			type: 'task-custom-node'
		});
		this.color = options.color || 'red';
		this.title = options.title || '';
		this.task = options.task;

		// setup an in and out port
		this.addPort(
			new DfRightAnglePortModel({
				in: true,
				name: 'in',
				extras: {
					taskid: this.task.taskid
				}
			})
		);
		this.addPort(
			new DfRightAnglePortModel({
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
			color: this.color,
			title: this.title,
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		this.color = event.data.color;
		this.title = event.data.title;
	}

	addSource(source: TaskNodeModel): DfRightAngleLinkModel {
		const inPort = source.getPort('in');
		const outPort = this.getPort('out');
		const link = new DfRightAngleLinkModel({
			sourceTaskId: source.task.taskid || '',
			targetTaskId: this.task.taskid || ''
		});
		link.getOptions().color = '#cbcbcb';
		link.setSourcePort(outPort);
		link.setTargetPort(inPort);

		return link;
	}
}
