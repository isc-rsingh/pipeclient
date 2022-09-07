import { DefaultLinkFactory, RightAngleLinkFactory } from '@projectstorm/react-diagrams';
import { DfRightAngleLinkWidget } from './DfRightAngleLink';
import { DfRightAngleLinkModel } from './DfRightAngleLinkModel';

export class DfRightAngleLinkFactory extends DefaultLinkFactory<DfRightAngleLinkModel> {
	static NAME = 'dfRightAngle';

	constructor() {
		super(RightAngleLinkFactory.NAME);
	}

	generateModel(event): DfRightAngleLinkModel {
		return new DfRightAngleLinkModel();
	}

	generateReactWidget(event): JSX.Element {
		return <DfRightAngleLinkWidget diagramEngine={this.engine} link={event.model} factory={this} />;
	}
}


