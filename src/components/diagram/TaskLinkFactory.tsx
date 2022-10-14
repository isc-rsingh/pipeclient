import { DefaultLinkFactory, RightAngleLinkFactory } from '@projectstorm/react-diagrams';
import { TaskLinkWidget } from './TaskLink';
import { TaskLinkModel } from './TaskLinkModel';

export class TaskLinkFactory extends DefaultLinkFactory<TaskLinkModel> {
	static NAME = 'advanced';

	constructor() {
		super(TaskLinkFactory.NAME);
	}

	generateModel(event): TaskLinkModel {
		return new TaskLinkModel();
	}

	generateReactWidget(event): JSX.Element {
		return <TaskLinkWidget diagramEngine={this.engine} link={event.model} />;
	}
}


