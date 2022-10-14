import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import {api, ICatalogPipelineResponse, ICatalogTaskResponse } from "../../services/api";
import { NameDialog } from "../nameDialog/nameDialog";
import moment from 'moment';

import { ReactComponent as RecipeIcon } from "../../assets/icons/type_recipe.svg";
import { ReactComponent as PipelineIcon } from "../../assets/icons/type_pipeline.svg";
import { ReactComponent as PublishedIcon } from "../../assets/icons/check_circle_outline.svg";
import { ReactComponent as ErrorIcon } from "../../assets/icons/error_outline.svg";

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
		let date = moment(ts);
		let displaytime = <div>---</div>;
		if (date.isValid())
			displaytime = <div><span>{date.fromNow()}</span><br/><span>at {date.format("h:mm:ss a")}</span></div>;
		
		return displaytime
	}

	function getMetadata(thething) {
        return (
            <div className="metadata">
                {getDescription(thething)}
                <div className="creator">
                    Created by: {thething.metadata.creator}
                </div>
                <div className="catalog-timestamps">
                    <div className='timestamp-container'>
                        <div className='timestamp-title'>Last Run</div>
                        <div className='timestamp-data'>{getRelativeTime(thething.metadata.lastrun)}</div>
                    </div>
                    <div className='timestamp-container'>
                        <div className='timestamp-title'>Last Modified</div>
                        <div className='timestamp-data'>{getRelativeTime(thething.metadata.modified)}</div>
                    </div>
                </div>
            </div>
        )
	}

	function getDescription(thething) {
        let desc = <div className="description">No description</div>;
		if (thething.metadata.description)
			desc = <div className="description">{thething.metadata.description}</div>;
		
		return desc
	}

	function getIndicators(thething) {
        return (
            <div className="indicators">
                
                {(thething.metadata?.publish) ? <PublishedIcon /> : <div>'NP'</div>}
                {(thething.metadata?.lasterror) ? <ErrorIcon /> : <div>'NE'</div>}
                <div className="numruns">{thething.metadata?.runs}</div>
                <div>0</div>
            </div>
        )
	}

    return <div className="startup-container">
        <h1 className="startup-title">Data Catalog</h1>
        <div className="startup-header">
            <Button size="large" onClick={createNewPipeline} variant="outlined">Create New Pipeline</Button>
            <div className="search-new-line">
                <TextField  fullWidth label="Search.." variant="outlined" placeholder="Search..." value={filterText} onChange={changeFilter} />
            </div>
        </div>
        <div className="pipeline-card-container">
            {filteredPipelines.map((p)=>{
                return <Card sx={{ width: 345 }} key={p.pipelineid} className="pipeline-card">
                        <CardContent>
                            <div className='custom-node-header'>
                                <PipelineIcon className="recipe-editor-header-icon" />
								<div className="title">{p.metadata.name|| p.pipelineid}</div>
                                {getIndicators(p)}
							</div>
                            {getMetadata(p)}
                        </CardContent>
                        <CardActions>
                            <Button size="small" href={"/pipeline/" + p.pipelineid} variant="outlined">Edit</Button>
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
                                {getIndicators(t)}
							</div>
                            {getMetadata(t)}
                        </CardContent>
                        <CardActions>
                            <Button size="small" href={"/task/" + t.taskid} variant="outlined">Edit</Button>
                        </CardActions>
                    </Card>
                }
                return null;
            })}
        </div>
        <NameDialog open={openNameDialog} title={'Pipeline Name'} onClose={newPipelineNamed} ></NameDialog>
    </div>;
}

export default StartupScreen;