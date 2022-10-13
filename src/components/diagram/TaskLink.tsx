import { DefaultLinkSegmentWidget, DefaultLinkWidget, DiagramEngine, LinkWidget, PointModel, RightAngleLinkState } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { Point } from '@projectstorm/geometry';
import { MouseEvent } from 'react';
import { TaskLinkFactory } from './TaskLinkFactory';
import { TaskLinkModel } from "./TaskLinkModel";


export interface TaskLineProps {
	color?: string;
	width?: number;
	smooth?: boolean;
	link: TaskLinkModel;
	diagramEngine: DiagramEngine;
	factory: TaskLinkFactory;
}

const CustomLinkArrowWidget = (props) => {
	const { point, previousPoint } = props;

	const angle =
		90 +
		(Math.atan2(
			point.getPosition().y - previousPoint.getPosition().y,
			point.getPosition().x - previousPoint.getPosition().x
		) *
			180) /
			Math.PI;

	//translate(50, -10),
	return (
		<g className="arrow" transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
			<g style={{ transform: 'rotate(' + angle + 'deg)' }}>
				<g transform={'translate(0, -3)'}>
					<polygon
						points="0,10 8,30 -8,30"
						fill={props.color}
						data-id={point.getID()}
						data-linkid={point.getLink().getID()}
					/>
				</g>
			</g>
		</g>
	);
};

export class TaskLinkWidget extends DefaultLinkWidget {
	generateArrow(point: PointModel, previousPoint: PointModel): JSX.Element {
		return (
			<CustomLinkArrowWidget
				key={point.getID()}
				point={point as any}
				previousPoint={previousPoint as any}
				colorSelected={this.props.link.getOptions().selectedColor}
				color={this.props.link.getOptions().color}
			/>
		);
	}

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];
		this.refPaths = [];

		if (points.length === 2) {
			paths.push(
				this.generateLink(
					this.props.link.getSVGPath(),
					{
						onMouseDown: (event) => {
							this.props.selected?.(event);
							this.addPointToLink(event, 1);
						}
					},
					'0'
				)
			);

			// draw the link as dangeling
			if (this.props.link.getTargetPort() == null) {
				paths.push(this.generatePoint(points[1]));
			}
		} else {
			//draw the multiple anchors and complex line instead
			for (let j = 0; j < points.length - 1; j++) {
				let lastPoint = points[j + 1].clone();
				if (j + 2 == points.length) {
					lastPoint.setPosition(lastPoint.getX()-10, lastPoint.getY());
				}
				paths.push(
					this.generateLink(
						LinkWidget.generateLinePath(points[j], lastPoint),
						{
							'data-linkid': this.props.link.getID(),
							'data-point': j,
							onMouseDown: (event: MouseEvent) => {
								this.addPointToLink(event, j + 1);
							}
						},
						j
					)
				);
			}
		}

		//render the circles
		for (let i = 1; i < points.length - 1; i++) {
			paths.push(this.generatePoint(points[i]));
		}

		if (this.props.link.getTargetPort() !== null) {
			let arrowAdjustment = points[points.length-1].clone();
			arrowAdjustment.setPosition(arrowAdjustment.getX()-10, arrowAdjustment.getY());
			paths.push(this.generateArrow(arrowAdjustment, points[points.length - 2]));
		} else {
			paths.push(this.generatePoint(points[points.length - 1]));
		}

		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}
