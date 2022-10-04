import { Avatar } from "@mui/material";
import abdul from "../../assets/headshots/abdul.jpg";
import amara from "../../assets/headshots/amara.jpg";
import ember from "../../assets/headshots/ember.jpg";
import jordon from "../../assets/headshots/jordon.jpg";
import you from "../../assets/headshots/you.jpg";

import "./useravatar.css";

export default function UserAvatar(props):JSX.Element {
    const imgArray = [abdul,amara,ember,jordon,you];
    const nameArray = ['Abdul Khatri','Amara Thompson','Ember Carey','Jordon Ibarra','Elle Jordan']
    let idx = props.index || Math.floor(Math.random() * 5);
    
    return (
        <div className="user-avatar">
            <span className="user-avatar-label">{props.label}</span>
            <div className="user-avatar-container">
                <Avatar src={imgArray[idx]} sx={{width:30, height:30}}/>
            </div>
            <span className="user-avatar-name">{nameArray[idx]}</span>
        </div>
    );
}