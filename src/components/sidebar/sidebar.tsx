import React from 'react';
import AvailableTasks from '../availabletasks/availabletasks';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './sidebar.css';
import PipelineOperations from '../pipelineoperations/pipelineoperations';

function Sidebar(): JSX.Element {
    return (
        <div>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
                    <Typography className='type-type-header-text'>Operations</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <PipelineOperations />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel12-header">
                    <Typography className='type-type-header-text'>Task Types</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AvailableTasks />
                </AccordionDetails>
            </Accordion>
        </div>
        
    )
}

export default Sidebar;