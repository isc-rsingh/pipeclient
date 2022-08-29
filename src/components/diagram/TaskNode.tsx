import { AbstractModelFactory, BaseModelOptions, CanvasEngine, CanvasEngineListener, CanvasModel, CanvasModelGenerics } from '@projectstorm/react-canvas-core';
import { DefaultNodeModel, DefaultPortModel, DiagramEngine, LinkModel, LinkModelGenerics, NodeModel, PortWidget, RightAngleLinkModel } from '@projectstorm/react-diagrams';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import React from 'react';

export class RightAnglePortModel extends DefaultPortModel {
	createLinkModel(factory?: AbstractModelFactory<LinkModel>) {
		return new RightAngleLinkModel();
	}
}

export interface TaskNodeModelOptions extends BaseModelOptions {
	color?: string;
    title?: string;
    taskid?: string;
}

export class TaskNodeModel extends DefaultNodeModel {
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
			new RightAnglePortModel({
				in: true,
				name: 'in'
			})
		);
		this.addPort(
			new RightAnglePortModel({
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

    addSource(source:TaskNodeModel): RightAngleLinkModel {
        const inPort = source.getPort('in');
        const outPort = this.getPort('out');
		const link = new RightAngleLinkModel();
		link.getOptions().color = '#333695';
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
                
                <div className="custom-node">
                    <PortWidget engine={this.props.engine} port={this.props.node.getPort('in')!}>
                        <div className="in-port" />
                    </PortWidget>
					<div className="title">
						{this.props.node.title}
					</div>
                    <PortWidget engine={this.props.engine} port={this.props.node.getPort('out')!}>
                        <div className="out-port" />
                    </PortWidget>
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