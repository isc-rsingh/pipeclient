import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DefaultPortModel, LinkModel } from '@projectstorm/react-diagrams';
import { TaskLinkModel } from "./TaskLinkModel";


export class TaskPortModel extends DefaultPortModel {
	createLinkModel(factory?: AbstractModelFactory<LinkModel>) {
		return new TaskLinkModel();
	}
}
