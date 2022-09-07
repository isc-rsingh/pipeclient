import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { Task } from '../../models/task';
import { TaskNodeModel } from "./TaskNodeModel";
import { name } from '../../services/name';

export interface TaskNodeWidgetProps {
	node: TaskNodeModel;
	engine: DiagramEngine;
	task: Task
}

export interface TaskNodeWidgetState { }

export class TaskNodeWidget extends React.Component<TaskNodeWidgetProps, TaskNodeWidgetState> {
	constructor(props: TaskNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="task-wrapper">
				<div className={`custom-node ${this.props.node.isSelected() ? "selected" : ""}`}>
					<PortWidget engine={this.props.engine} port={this.props.node.getPort('in')!}>
						<div className="in-port" />
					</PortWidget>
					<div className="title">
						{name.getTaskName(this.props.task)}
					</div>
					<PortWidget engine={this.props.engine} port={this.props.node.getPort('out')!}>
						<div className={`out-port ${this.props.node.isSelected() ? "selected" : ""}`} />
					</PortWidget>
				</div>
			</div>
		);
	}
}
