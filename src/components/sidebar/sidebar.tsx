import React from 'react';
import AvailableTasks from '../availabletasks/availabletasks';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import './sidebar.css';
import PipelineOperations from '../pipelineoperations/pipelineoperations';

function Sidebar(): JSX.Element {
    return (
        <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton><span className='type-type-header-text'>Operations</span></AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    <PipelineOperations />
                </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton><span className='type-type-header-text'>Task Types</span></AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    <AvailableTasks />
                </AccordionItemPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default Sidebar;