import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { Task } from '../../models/task';
import { TaskNodeModel } from "./TaskNodeModel";
import { name } from '../../services/name';
import { api } from '../../services/api';

import './TaskNodeWidget.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { connect } from 'react-redux';
import { removeFullscreenPipelineEditor, setDataPreview, showDataPreviewPanel, showRecipePropertiesPanel } from '../../stores/ui-state-store';
import { Pipeline } from '../../models/pipeline';
import { TaskTypes } from '../../services/taskTypeHelper';
import taskRunService from '../../services/taskRunService';
// import { taskHelper } from '../../services/taskHelper';
import moment from 'moment';

export interface TaskNodeWidgetProps {
	node: TaskNodeModel;
	engine: DiagramEngine;
	task: Task;
	pipeline: Pipeline;
	fullscreenPipelineEditor:boolean;
	runningTasks:string[];
	setDataPreview:(data)=>void;
	showDataPreviewPanel:(payload)=>void;
	showRecipePropertiesPanel:(payload)=>void;
	removeFullscreenPipelineEditor:(payload)=>void;
}

export interface TaskNodeWidgetState { 
	mouseX?:number;
	mouseY?:number;
	taskInProcess:boolean;
	taskInError:boolean;
	taskSuccess:boolean;
}

class TaskNodeWidget extends React.Component<TaskNodeWidgetProps, TaskNodeWidgetState> {
	constructor(props: TaskNodeWidgetProps) {
		super(props);
		
		const taskInError = (!props.task?.metadata?.clean) || false;
		const taskSuccess = (!!props.task?.metadata?.clean) || false;
		const taskInProcess = (props.runningTasks.includes(props.task.taskid));

		this.state = {
			taskInProcess,
			taskInError,
			taskSuccess,
		};
	}

	taskCount():number {
		let rslt = 0;
		if (this.props.task?.source) {
			this.props.task.source.tasks.forEach(t=>{
				const sourceTask = this.props.pipeline.taskCopies.find(tc=>tc.taskid===t);
				if (sourceTask && sourceTask.type !== TaskTypes.TaskRecipe) {
					rslt++;
				}
			});
		}
		return rslt;
	}
	
	addNewTask(event) {
		console.log('Handled');
	}

	handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		this.setState(!this.state.mouseX ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6,} :  {mouseX:null, mouseY:null});
	};

	handleContextClose() {
		this.setState({mouseX:null, mouseY:null});
	}

	runTask() {
		this.handleContextClose();
		this.setState({taskInProcess:true, taskSuccess: false});
		taskRunService.runTask(this.props.task.taskid).then((r)=>{
			if (r.status === 1) {
				this.setState({taskInProcess:false, taskInError: false, taskSuccess: true});
			} else {
				this.setState({taskInProcess:false, taskInError: true, taskSuccess: false});
			}
		});
	}

	showProperties() {
		api.getDataPreview(this.props.task.taskid).then(x=>{
			this.props.setDataPreview(x.children);
			this.props.showDataPreviewPanel({});
		});
		if (this.props.fullscreenPipelineEditor) {
			this.props.removeFullscreenPipelineEditor({});
		}
		this.props.showRecipePropertiesPanel({});
		// setTimeout(()=>{
		// 	this.props.engine.zoomToFitNodes({nodes:[this.props.node]});
		// },250);
	}

	setSelected() {
		this.props.node.setSelected(true);
		this.forceUpdate();
	}

	getRelativeTime(ts) {
		// let testingHelper = taskHelper.getFieldsForTask(this.props.pipeline, this.props.task.taskid);

		let date = moment(ts);
		let displaytime = "---";
		if (date.isValid())
			displaytime = date.fromNow() + " at " + date.format("h:mm:ss a");
		
		return displaytime
	}

	getErrorMessage() {
		if (this.state.taskInError) {
			return (
				<div className="task-error-container">
					<div className="task-error-message one-line" title={this.props.task.metadata.lasterror}>
					{this.props.task.metadata.lasterror}
					</div>
				</div>
			)
		} else return (<div className='task-no-error'></div>);
	}

	render() {
		return (
			<div className='task-container' onContextMenu={this.handleContextMenu.bind(this)} onClick={this.setSelected.bind(this)} onDoubleClick={this.showProperties.bind(this)}>
				<div className={`task-wrapper ${this.state.taskInProcess ? 'task-in-process' : ''} ${this.state.taskInError && !this.state.taskInProcess ? 'task-in-error' : ''} ${this.state.taskSuccess && !this.state.taskInProcess ? 'task-success' : ''} ${this.props.node.isSelected() ? "selected" : ""}`}>
					<div className={`custom-node-wrapper ${this.props.node.isSelected() ? "selected" : ""}`}>
						<div className='custom-node'>
							<div className='custom-node-header'>
								<PortWidget engine={this.props.engine} port={this.props.node.getPort('in')!}>
									<div className="in-port" />
								</PortWidget>
								<div className="title">
									{name.getTaskName(this.props.task)}
								</div>
								<div className='task-count'>{this.taskCount()}</div>
								<PortWidget engine={this.props.engine} port={this.props.node.getPort('out')!}>
									<div className={`out-port ${this.props.node.isSelected() ? "selected" : ""}`} title={(this.props.task?.metadata?.lasterror) || ''}/>
								</PortWidget>
							</div>
							<div className='timestamp-container'>
								<div className='timestamp-title'>Last Run</div>
								<div className='timestamp-data'>{this.getRelativeTime(this.props.task.metadata.lastrun)}</div>
							</div>
							<div className='timestamp-container'>
								<div className='timestamp-title'>Last Modified</div>
								<div className='timestamp-data'>{this.getRelativeTime(this.props.task.metadata.modified)}</div>
							</div>
							{this.getErrorMessage()}
						</div>
					</div>
				</div>
				<div className='add-new-task-line'>
					<FontAwesomeIcon icon={faSquarePlus} className="add-task-plus" onClick={this.addNewTask.bind(this)}></FontAwesomeIcon>
				</div>
				<Menu open={!!this.state?.mouseX} onClose={this.handleContextClose.bind(this)} anchorReference="anchorPosition"
					anchorPosition={
					this.state.mouseX
						? { top: this.state.mouseY, left: this.state.mouseX }
						: undefined
					}>
						<MenuItem onClick={this.showProperties.bind(this)}>
							<ListItemIcon><CreateOutlinedIcon /></ListItemIcon>
							<ListItemText>Properties</ListItemText>
						</MenuItem>
						<MenuItem onClick={this.runTask.bind(this)}>
							<ListItemIcon><PlayArrowOutlinedIcon /></ListItemIcon>
							<ListItemText>Run task</ListItemText>
						</MenuItem>
				</Menu>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        showDataPreviewPanel:(payload) => dispatch(showDataPreviewPanel(payload)),
		showRecipePropertiesPanel:(payload) => dispatch(showRecipePropertiesPanel(payload)),
		setDataPreview:(payload)=> dispatch(setDataPreview(payload)),
		removeFullscreenPipelineEditor:(payload) => dispatch(removeFullscreenPipelineEditor(payload)),
    }
}
const mapStateToProps = (state, ownProps) => {
	return {
		pipeline: state.pipelineEditor.value,
		fullscreenPipelineEditor:state.uiState.value.fullscreenPipelineEditor,
		runningTasks: state.uiState.value.runningTasks,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskNodeWidget);