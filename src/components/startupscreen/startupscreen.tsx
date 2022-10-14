import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import {api, ICatalogPipelineResponse, ICatalogTaskResponse } from "../../services/api";
import { NameDialog } from "../nameDialog/nameDialog";
import moment from 'moment';

import { ReactComponent as RecipeIcon } from "../../assets/icons/type_recipe.svg";
import { ReactComponent as PipelineIcon } from "../../assets/icons/type_pipeline.svg";

import './startupscreen.css';

let pipelines;
let tasks;
function StartupScreen():JSX.Element {
    const [filteredPipelines, setFilteredPipelines] = useState<ICatalogPipelineResponse[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<ICatalogTaskResponse[]>([]);
    const [filterText, setFilterText] = useState("");
    const [openNameDialog, setOpenNameDialog]=useState(false);
    let navigate = useNavigate();

    useEffect(()=>{
        if (!pipelines) {
            api.getCatalog().then(c=>{
                setFilteredPipelines(c.pipelines);
                setFilteredTasks(c.tasks);
                pipelines = c.pipelines;
                tasks = c.tasks;
            });
        }
    })
    
    function changeFilter(ev) {
        setFilterText(ev.target.value);
        const filtered = pipelines.filter(x=>(x.name || x.pipelineid).toUpperCase().includes(ev.target.value.toUpperCase()));
        const taskfiltered = tasks.filter(x=>(x.metadata.name || x.taskid).toUpperCase().includes(ev.target.value.toUpperCase()));
        setFilteredPipelines(filtered);
        setFilteredTasks(taskfiltered);
    }

    function createNewPipeline() {
        setOpenNameDialog(true);
        // api.createEmptyPipeline().then((p)=>{
        //     navigate('/pipeline/' + p.id);
        // });
    }

    function newPipelineNamed(name:string) {
        setOpenNameDialog(false);
        if (name) {
            api.createEmptyPipeline(name).then((p)=>{
                navigate('/pipeline/' + (p.pipelineid || p.id));
            });
        }
    }

	function getRelativeTime(ts) {
		// let testingHelper = taskHelper.getFieldsForTask(this.props.pipeline, this.props.task.taskid);

		let date = moment(ts);
		let displaytime = "---";
		if (date.isValid())
			displaytime = date.fromNow() + " at " + date.format("h:mm:ss a");
		
		return displaytime
	}

    return <div className="startup-container">
        <div className="search-new-line">
            <TextField  fullWidth label="Search.." variant="outlined" placeholder="Search..." value={filterText} onChange={changeFilter} />
        </div>
        <div className="pipeline-card-container">
            <Card sx={{ width: 345 }} className="pipeline-card">
                <CardContent>
                    <Typography variant="h6" component="div">
                        Create New Pipeline
                    </Typography>
                    <Typography variant="body2">
                        Create a brand new data pipeline made of pre-existing recipes and tasks.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={createNewPipeline}>Create New...</Button>
                </CardActions>
            </Card>
            {filteredPipelines.map((p)=>{
                return <Card sx={{ width: 345 }} key={p.pipelineid} className="pipeline-card">
                        <CardContent>
                        <div className='custom-node-header'>
                                <PipelineIcon className="recipe-editor-header-icon" />
								<div className="title">{p.name|| p.pipelineid}</div>
								{/* <div className='task-count'>{this.taskCount()}</div> */}
								{/* <PortWidget engine={this.props.engine} port={this.props.node.getPort('out')!}>
									<div className={`out-port ${this.props.node.isSelected() ? "selected" : ""}`} title={(this.props.task?.metadata?.lasterror) || ''}/>
								</PortWidget> */}
							</div>
                            <Typography variant="body2">
                                Created by: {p.creator}
                            </Typography>
							<div className='timestamp-container'>
								<div className='timestamp-title'>Last Run</div>
								<div className='timestamp-data'>{getRelativeTime(p.lastrun)}</div>
							</div>
							<div className='timestamp-container'>
								<div className='timestamp-title'>Last Modified</div>
								<div className='timestamp-data'>{getRelativeTime(p.modified)}</div>
							</div>
                        </CardContent>
                        <CardActions>
                            <Button size="small" href={"/pipeline/" + p.pipelineid}>Edit...</Button>
                        </CardActions>
                    </Card>
            })}
            {filteredTasks.map((t)=>{
                if (t.type === "rs.pipeline.TaskRecipe") {
                    return <Card sx={{ width: 345 }} key={t.taskid} className="pipeline-card">
                        <CardContent>
							<div className='custom-node-header'>
                                <RecipeIcon className="recipe-editor-header-icon" />
								<div className="title">{t.metadata.name|| t.taskid}</div>
								{/* <div className='task-count'>{this.taskCount()}</div> */}
								{/* <PortWidget engine={this.props.engine} port={this.props.node.getPort('out')!}>
									<div className={`out-port ${this.props.node.isSelected() ? "selected" : ""}`} title={(this.props.task?.metadata?.lasterror) || ''}/>
								</PortWidget> */}
							</div>
                            <Typography variant="body2">
                                Created by: {t.metadata.creator}
                            </Typography>
							<div className='timestamp-container'>
								<div className='timestamp-title'>Runs</div>
								<div className='timestamp-data'>{getRelativeTime(t.metadata.runs)}</div>
							</div>
							<div className='timestamp-container'>
								<div className='timestamp-title'>Last Modified</div>
								<div className='timestamp-data'>{getRelativeTime(t.metadata.modified)}</div>
							</div>
                        </CardContent>
                        <CardActions>
                            <Button size="small" href={"/task/" + t.taskid}>Edit...</Button>
                        </CardActions>
                    </Card>
                }
            })}
        </div>
        <NameDialog open={openNameDialog} title={'Pipeline Name'} onClose={newPipelineNamed} ></NameDialog>
    </div>;
}

export default StartupScreen;