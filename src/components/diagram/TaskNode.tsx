import { AbstractModelFactory, BaseModelOptions} from '@projectstorm/react-canvas-core';
import { DefaultLinkFactory, DefaultLinkModel, DefaultLinkModelOptions, DefaultLinkSegmentWidget, DefaultNodeModel, DefaultPortModel, DiagramEngine, LinkModel,  LinkWidget, PointModel, PortWidget, RightAngleLinkFactory,  RightAngleLinkState } from '@projectstorm/react-diagrams';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import * as React from 'react';
import { Point } from '@projectstorm/geometry';
import { MouseEvent } from 'react';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';

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

export class DfRightAngleLinkModelOptions implements DefaultLinkModelOptions {
	width?: number;
    color?: string;
    selectedColor?: string;
    curvyness?: number;
    type?: string;
    testName?: string;

	sourceTaskId?:string;
	targetTaskId?:string;
}

export class DfRightAngleLinkModel extends DefaultLinkModel {
	lastHoverIndexOfPath: number;
	private _lastPathXdirection: boolean;
	private _firstPathXdirection: boolean;

	public sourceTaskId: string;
	public targetTaskId: string;

	constructor(options: DfRightAngleLinkModelOptions = {}) {
		super({
			type: RightAngleLinkFactory.NAME,
			...options
		});
		this.lastHoverIndexOfPath = 0;
		this._lastPathXdirection = false;
		this._firstPathXdirection = false;
		this.sourceTaskId = options.sourceTaskId;
		this.targetTaskId = options.targetTaskId;
	}

	setFirstAndLastPathsDirection() {
		let points = this.getPoints();
		for (let i = 1; i < points.length; i += points.length - 2) {
			let dx = Math.abs(points[i].getX() - points[i - 1].getX());
			let dy = Math.abs(points[i].getY() - points[i - 1].getY());
			if (i - 1 === 0) {
				this._firstPathXdirection = dx > dy;
			} else {
				this._lastPathXdirection = dx > dy;
			}
		}
	}

	// @ts-ignore
	addPoint<P extends PointModel>(pointModel: P, index: number = 1): P {
		// @ts-ignore
		super.addPoint(pointModel, index);
		this.setFirstAndLastPathsDirection();
		return pointModel;
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.setFirstAndLastPathsDirection();
	}

	setManuallyFirstAndLastPathsDirection(first, last) {
		this._firstPathXdirection = first;
		this._lastPathXdirection = last;
	}

	getLastPathXdirection(): boolean {
		return this._lastPathXdirection;
	}
	getFirstPathXdirection(): boolean {
		return this._firstPathXdirection;
	}

	setWidth(width: number) {
		this.options.width = width;
		this.fireEvent({ width }, 'widthChanged');
	}

	setColor(color: string) {
		this.options.color = color;
		this.fireEvent({ color }, 'colorChanged');
	}
}

export interface DfRightAngleLinkProps {
	color?: string;
	width?: number;
	smooth?: boolean;
	link: DfRightAngleLinkModel;
	diagramEngine: DiagramEngine;
	factory: DfRightAngleLinkFactory;
}

export class DfRightAngleLinkWidget extends React.Component<DfRightAngleLinkProps, RightAngleLinkState> {
	public static defaultProps: DfRightAngleLinkProps = {
		color: 'red',
		width: 3,
		link: null,
		smooth: false,
		diagramEngine: null,
		factory: null
	};

	refPaths: React.RefObject<SVGPathElement>[];

	// DOM references to the label and paths (if label is given), used to calculate dynamic positioning
	refLabels: { [id: string]: HTMLElement };
	dragging_index: number;

	constructor(props: DfRightAngleLinkProps) {
		super(props);

		this.refPaths = [];
		this.state = {
			selected: false,
			canDrag: false
		};

		this.dragging_index = 0;
	}

	componentDidUpdate(): void {
		this.props.link.setRenderedPaths(
			this.refPaths.map((ref) => {
				return ref.current;
			})
		);
	}

	componentDidMount(): void {
		this.props.link.setRenderedPaths(
			this.refPaths.map((ref) => {
				return ref.current;
			})
		);
	}

	componentWillUnmount(): void {
		this.props.link.setRenderedPaths([]);
	}

	generateLink(path: string, extraProps: any, id: string | number): JSX.Element {
		const ref = React.createRef<SVGPathElement>();
		this.refPaths.push(ref);
		return (
			<DefaultLinkSegmentWidget
				key={`link-${id}`}
				path={path}
				selected={this.state.selected}
				diagramEngine={this.props.diagramEngine}
				factory={this.props.diagramEngine.getFactoryForLink(this.props.link)}
				link={this.props.link}
				forwardRef={ref}
				onSelection={(selected) => {
					this.setState({ selected: selected });
				}}
				extras={extraProps}
			/>
		);
	}

	calculatePositions(points: PointModel[], event: MouseEvent, index: number, coordinate: string) {
		// If path is first or last add another point to keep node port on its position
		if (index === 0) {
			let point = new PointModel({
				link: this.props.link,
				position: new Point(points[index].getX(), points[index].getY())
			});
			this.props.link.addPoint(point, index);
			this.dragging_index++;
			return;
		} else if (index === points.length - 2) {
			let point = new PointModel({
				link: this.props.link,
				position: new Point(points[index + 1].getX(), points[index + 1].getY())
			});
			this.props.link.addPoint(point, index + 1);
			return;
		}

		// Merge two points if it is not close to node port and close to each other
		if (index - 2 > 0) {
			let _points = {
				[index - 2]: points[index - 2].getPosition(),
				[index + 1]: points[index + 1].getPosition(),
				[index - 1]: points[index - 1].getPosition()
			};
			if (Math.abs(_points[index - 1][coordinate] - _points[index + 1][coordinate]) < 5) {
				_points[index - 2][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				_points[index + 1][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				points[index - 2].setPosition(_points[index - 2]);
				points[index + 1].setPosition(_points[index + 1]);
				points[index - 1].remove();
				points[index - 1].remove();
				this.dragging_index--;
				this.dragging_index--;
				return;
			}
		}

		// Merge two points if it is not close to node port
		if (index + 2 < points.length - 2) {
			let _points = {
				[index + 3]: points[index + 3].getPosition(),
				[index + 2]: points[index + 2].getPosition(),
				[index + 1]: points[index + 1].getPosition(),
				[index]: points[index].getPosition()
			};
			if (Math.abs(_points[index + 1][coordinate] - _points[index + 2][coordinate]) < 5) {
				_points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				_points[index + 3][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
				points[index].setPosition(_points[index]);
				points[index + 3].setPosition(_points[index + 3]);
				points[index + 1].remove();
				points[index + 1].remove();
				return;
			}
		}

		// If no condition above handled then just update path points position
		let _points = {
			[index]: points[index].getPosition(),
			[index + 1]: points[index + 1].getPosition()
		};
		_points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
		_points[index + 1][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
		points[index].setPosition(_points[index]);
		points[index + 1].setPosition(_points[index + 1]);
	}

	draggingEvent(event: MouseEvent, index: number) {
		let points = this.props.link.getPoints();
		// get moving difference. Index + 1 will work because links indexes has
		// length = points.lenght - 1
		let dx = Math.abs(points[index].getX() - points[index + 1].getX());
		let dy = Math.abs(points[index].getY() - points[index + 1].getY());

		// moving with y direction
		if (dx === 0) {
			this.calculatePositions(points, event, index, 'x');
		} else if (dy === 0) {
			this.calculatePositions(points, event, index, 'y');
		}
		this.props.link.setFirstAndLastPathsDirection();
	}

	handleMove = function (event: MouseEvent) {
		this.draggingEvent(event, this.dragging_index);
	}.bind(this);

	handleUp = function (event: MouseEvent) {
		// Unregister handlers to avoid multiple event handlers for other links
		this.setState({ canDrag: false, selected: false });
		window.removeEventListener('mousemove', this.handleMove);
		window.removeEventListener('mouseup', this.handleUp);
	}.bind(this);

	render() {
		//ensure id is present for all points on the path
		let points = this.props.link.getPoints();
		let paths = [];

		// Get points based on link orientation
		let pointLeft = points[0];
		let pointRight = points[points.length - 1];
		let hadToSwitch = false;
		if (pointLeft.getX() > pointRight.getX()) {
			pointLeft = points[points.length - 1];
			pointRight = points[0];
			hadToSwitch = true;
		}
		let dy = Math.abs(points[0].getY() - points[points.length - 1].getY());

		// When new link add one middle point to get everywhere 90° angle
		if (this.props.link.getTargetPort() === null && points.length === 2) {
			[...Array(2)].forEach((item) => {
				this.props.link.addPoint(
					new PointModel({
						link: this.props.link,
						position: new Point(pointLeft.getX(), pointRight.getY())
					}),
					1
				);
			});
			this.props.link.setManuallyFirstAndLastPathsDirection(true, true);
		}
		// When new link is moving and not connected to target port move with middle point
		// TODO: @DanielLazarLDAPPS This will be better to update in DragNewLinkState
		//  in function fireMouseMoved to avoid calling this unexpectedly e.g. after Deserialize
		else if (this.props.link.getTargetPort() === null && this.props.link.getSourcePort() !== null) {
			points[1].setPosition(
				pointRight.getX() + (pointLeft.getX() - pointRight.getX()) / 2,
				!hadToSwitch ? pointLeft.getY() : pointRight.getY()
			);
			points[2].setPosition(
				pointRight.getX() + (pointLeft.getX() - pointRight.getX()) / 2,
				!hadToSwitch ? pointRight.getY() : pointLeft.getY()
			);
		}
		// Render was called but link is not moved but user.
		// Node is moved and in this case fix coordinates to get 90° angle.
		// For loop just for first and last path
		else if (!this.state.canDrag && points.length > 2) {
			// Those points and its position only will be moved
			for (let i = 1; i < points.length; i += points.length - 2) {
				if (i - 1 === 0) {
					if (this.props.link.getFirstPathXdirection()) {
						points[i].setPosition(points[i].getX(), points[i - 1].getY());
					} else {
						points[i].setPosition(points[i - 1].getX(), points[i].getY());
					}
				} else {
					if (this.props.link.getLastPathXdirection()) {
						points[i - 1].setPosition(points[i - 1].getX(), points[i].getY());
					} else {
						points[i - 1].setPosition(points[i].getX(), points[i - 1].getY());
					}
				}
			}
		}

		// If there is existing link which has two points add one
		// NOTE: It doesn't matter if check is for dy or dx
		if (points.length === 2 && dy !== 0 && !this.state.canDrag) {
			this.props.link.addPoint(
				new PointModel({
					link: this.props.link,
					position: new Point(pointLeft.getX(), pointRight.getY())
				})
			);
		}

		for (let j = 0; j < points.length - 1; j++) {
			paths.push(
				this.generateLink(
					LinkWidget.generateLinePath(points[j], points[j + 1]),
					{
						'data-linkid': this.props.link.getID(),
						'data-point': j,
						onMouseDown: (event: MouseEvent) => {
							if (event.button === 0) {
								this.setState({ canDrag: true });
								this.dragging_index = j;
								// Register mouse move event to track mouse position
								// On mouse up these events are unregistered check "this.handleUp"
								window.addEventListener('mousemove', this.handleMove);
								window.addEventListener('mouseup', this.handleUp);
							}
						},
						onMouseEnter: (event: MouseEvent) => {
							this.setState({ selected: true });
							this.props.link.lastHoverIndexOfPath = j;
						}
					},
					j
				)
			);
		}

		this.refPaths = [];
		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}

export class DfRightAnglePortModel extends DefaultPortModel {
	createLinkModel(factory?: AbstractModelFactory<LinkModel>) {
		return new DfRightAngleLinkModel();
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
			new DfRightAnglePortModel({
				in: true,
				name: 'in',
				extras: { 
					taskid:this.taskid
				}
			})
		);
		this.addPort(
			new DfRightAnglePortModel({
				in: false,
				name: 'out',
				extras: { 
					taskid:this.taskid
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

	deserialize(event:any): void {
		super.deserialize(event);
		this.color = event.data.color;
        this.title = event.data.title;
	}

    addSource(source:TaskNodeModel): DfRightAngleLinkModel {
        const inPort = source.getPort('in');
        const outPort = this.getPort('out');
		const link = new DfRightAngleLinkModel({
			sourceTaskId:source.taskid || '',
			targetTaskId:this.taskid || ''
		});
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
                <div className={ `custom-node ${this.props.node.isSelected() ? "selected":""}`} >
                    <PortWidget engine={this.props.engine} port={this.props.node.getPort('in')!}>
                        <div className="in-port" />
                    </PortWidget>
					<div className="title">
						{this.props.node.title}
					</div>
                    <PortWidget engine={this.props.engine} port={this.props.node.getPort('out')!}>
                        <div className={ `out-port ${this.props.node.isSelected() ? "selected":""}`} />
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