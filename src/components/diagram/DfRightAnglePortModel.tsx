import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DefaultPortModel, LinkModel } from '@projectstorm/react-diagrams';
import { DfRightAngleLinkModel } from "./DfRightAngleLinkModel";


export class DfRightAnglePortModel extends DefaultPortModel {
	createLinkModel(factory?: AbstractModelFactory<LinkModel>) {
		return new DfRightAngleLinkModel();
	}
}
