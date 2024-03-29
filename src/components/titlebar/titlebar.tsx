import React from 'react';
import './titlebar.css';
import {ReactComponent as IconMenu} from './icon-menu.svg';
import {ReactComponent as IconProfile} from './icon-profile.svg';
import ProductIcon from './product-icon.png';
import {user} from '../../services/user';

export interface TitlebarProps {
    toggledrawer:()=>void;
}
function Titlebar(props:TitlebarProps): JSX.Element {
    return (
        <header className='titlebar-container'>
            <div className='user-info'>
                <IconProfile className='user' stroke="black" fill="black"></IconProfile>
                <span className='user-name'>{user.getCurrentUser()}</span>
            </div>
            <div className='main-title-area'>
                <IconMenu stroke="black" fill="black" className='menu' onClick={props.toggledrawer}/>
                <img src={ProductIcon} className='product-icon' alt=""></img>
                <span className='app-title'>Data Pipeline Editor</span>
            </div>
        </header>
    )
}

export default Titlebar;