import React from 'react';
import AvailableTasks from '../availabletasks/availabletasks';
import './sidebar.css';

function Sidebar(): JSX.Element {
    return (
        <aside className='open'>
            <AvailableTasks></AvailableTasks>
        </aside>
    )
}

export default Sidebar;