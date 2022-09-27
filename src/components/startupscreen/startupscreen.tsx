import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import {api, ICatalogPipelineResponse } from "../../services/api";
import { NameDialog } from "../nameDialog/nameDialog";

import './startupscreen.css';

let pipelines;
function StartupScreen():JSX.Element {
    const [filteredPipelines, setFilteredPipelines] = useState<ICatalogPipelineResponse[]>([]);
    const [filterText, setFilterText] = useState("");
    const [openNameDialog, setOpenNameDialog]=useState(false);
    let navigate = useNavigate();

    useEffect(()=>{
        if (!pipelines) {
            api.getCatalog().then(c=>{
                setFilteredPipelines(c.pipelines);
                pipelines = c.pipelines;
            });
        }
    })
    
    function changeFilter(ev) {
        setFilterText(ev.target.value);
        const filtered = pipelines.filter(x=>(x.name || x.pipelineid).toUpperCase().includes(ev.target.value.toUpperCase()));
        setFilteredPipelines(filtered);
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
                            <Typography variant="h6" component="div">
                                {p.name || p.pipelineid}
                            </Typography>
                            <Typography variant="body2">
                                Created by: {p.creator}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" href={"/pipeline/" + p.pipelineid}>Edit...</Button>
                        </CardActions>
                    </Card>
            })}
        </div>
        <NameDialog open={openNameDialog} title={'Pipeline Name'} onClose={newPipelineNamed} ></NameDialog>
    </div>;
}

export default StartupScreen;