import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {api, ICatalogPipelineResponse } from "../../services/api";

import './startupscreen.css';

let pipelines;
function StartupScreen():JSX.Element {
    const [filteredPipelines, setFilteredPipelines] = useState<ICatalogPipelineResponse[]>([]);
    const [filterText, setFilterText] = useState("");
    
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
                    <Button size="small">Create New...</Button>
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
    </div>;
}

export default StartupScreen;