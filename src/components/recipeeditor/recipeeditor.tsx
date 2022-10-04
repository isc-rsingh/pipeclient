import { useDispatch, useSelector } from "react-redux";
import { Task } from "../../models/task";

import { ReactComponent as RecipeIcon } from "../../assets/icons/type_recipe.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/type_edit.svg";
import { ReactComponent as CompletedIcon } from "../../assets/icons/type_completed.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/type_close.svg";

import "./recipeeditor.css";
import { name } from "../../services/name";
import UserAvatar from "../useravatar/useravatar";
import { useState } from "react";
import { setTaskProperty } from "../../stores/pipeline-editor-store";

export default function RecipeEditor(props):JSX.Element {

    var selectedTask:Task = useSelector((state:any)=>state.uiState.value.selectedTask)
    var [editDescription,setEditDescription] = useState(false);
    var [description, setDescription] = useState(selectedTask?.metadata?.description || '');
    var [imageIdx] = useState(Math.floor(Math.random() * 5));
    var dispatch = useDispatch();

    if (!selectedTask) {return;}

    function toggleDescription()     {
        setEditDescription(!editDescription);
    }

    function descriptionChange(ev) {
        setDescription(ev.target.value);
    }

    function saveDescription() {
        dispatch(setTaskProperty({
            task:selectedTask,
            path:'metadata.description',
            value:description
        }));
        toggleDescription();
    }

    return (
        <div className="recipe-editor-container">
            <div className="recipe-editor-header">
                <RecipeIcon className="recipe-editor-header-icon" />
                <h1 className="recipe-editor-recipe-name">{name.getTaskName(selectedTask)}</h1>
                { !editDescription && <span className="recipe-editor-recipe-description">{description || 'Description...'}</span> }
                { editDescription && <input type="text" placeholder={"Enter description"} value={description} onChange={descriptionChange} className='recipe-editor-recipe-description' /> }
                { !editDescription && <EditIcon className="recipe-editor-edit-icon" onClick={toggleDescription} /> }
                { editDescription && <CompletedIcon className="recipe-editor-edit-icon" onClick={saveDescription}/>}
                { editDescription && <CloseIcon className="recipe-editor-edit-icon" onClick={toggleDescription} />}
                <div className="recipe-editor-last-modified">
                    <UserAvatar label="Last modified by:" index={imageIdx}></UserAvatar>
                </div>
            </div>
        </div>
    );
}