import { DefaultLinkModel, DefaultLinkModelOptions, PointModel, RightAngleLinkFactory } from '@projectstorm/react-diagrams';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';


export class TaskLinkModelOptions implements DefaultLinkModelOptions {
	width?: number;
	color?: string;
	selectedColor?: string;
	curvyness?: number;
	type?: string;
	testName?: string;

	sourceTaskId?: string;
	targetTaskId?: string;
}

export class TaskLinkModel extends DefaultLinkModel {
	
	public sourceTaskId: string;
	public targetTaskId: string;

	constructor(options:TaskLinkModelOptions={}) {
		super({
			...options,
			type: 'advanced',
			width: 4,
		});

		this.sourceTaskId = options.sourceTaskId;
		this.targetTaskId = options.targetTaskId;
	}
}
