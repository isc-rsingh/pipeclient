import { BaseModelOptions } from '@projectstorm/react-canvas-core';
import { DiagramEngine, NodeModel, PortWidget } from '@projectstorm/react-diagrams';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import React from 'react';
import { TaskLinkModel, TaskPortModel } from './TaskLinkWidget';

export interface TaskNodeModelOptions extends BaseModelOptions {
	color?: string;
    title?: string;
    taskid?: string;
}

export class TaskNodeModel extends NodeModel {
	color: string;
    title: string;
    taskid?: string;

	constructor(options: TaskNodeModelOptions = {}) {
		super({
			...options,
			type: 'task-custom-node'
		});
		this.color = options.color || 'red';
        this.title = options.title || '';
        this.taskid = options.taskid || '';

		// setup an in and out port
		this.addPort(
			new TaskPortModel({
				in: true,
				name: 'in'
			})
		);
		this.addPort(
			new TaskPortModel({
				in: false,
				name: 'out'
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

	deserialize(event:any): void {
		super.deserialize(event);
		this.color = event.data.color;
        this.title = event.data.title;
	}

    addSource(source:TaskNodeModel): TaskLinkModel {
        const inPort = source.getPort('in');
        const outPort = this.getPort('out');
        const link = new TaskLinkModel();
        link.setSourcePort(outPort);
        link.setTargetPort(inPort);

        return link;
    }
}

export interface TaskNodeWidgetProps {
	node: TaskNodeModel;
	engine: DiagramEngine;
}

export interface TaskNodeWidgetState {}

export class TaskNodeWidget extends React.Component<TaskNodeWidgetProps, TaskNodeWidgetState> {
	constructor(props: TaskNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
            <div className="task-wrapper">
                <div className="title">
                    {this.props.node.title}
                </div>
                <div className="custom-node">
                    <PortWidget engine={this.props.engine} port={this.props.node.getPort('in')!}>
                        <div className="circle-port" />
                    </PortWidget>
                    <PortWidget engine={this.props.engine} port={this.props.node.getPort('out')!}>
                        <div className="circle-port" />
                    </PortWidget>
                    <div className="custom-node-color" style={{ backgroundColor: this.props.node.color }} />
                </div>
            </div>
		);
	}
}

export class TaskNodeFactory extends AbstractReactFactory<TaskNodeModel, DiagramEngine> {
	constructor() {
		super('task-custom-node');
	}

	generateModel(initialConfig:any) {
		return new TaskNodeModel();
	}

	generateReactWidget(event:any): JSX.Element {
		return <TaskNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}