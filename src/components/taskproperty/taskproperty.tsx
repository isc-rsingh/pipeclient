import { connect } from 'react-redux';
import React from 'react';
import { Task } from "../../models/task";
import { debounce } from '../../services/debounce';
import { setTaskProperty } from '../../stores/pipeline-editor-store';
import './taskproperty.css';


function getValue(object, path) {
    return path.
        replace(/\[/g, '.').
        replace(/\]/g, '').
        split('.').
        reduce((o, k) => (o || {})[k], object);
}

export interface TaskPropertyProps {
    task:Task;
    propertyPath:string;
    caption:string;
    setTaskProperty:(payload:any)=>void;
}

class TaskProperty extends React.Component<TaskPropertyProps> {
    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        const {task, propertyPath} = this.props;
        this.setState({textValue:getValue(task,propertyPath)});   
    }

    state = {
        textValue:''
    };

    debounceSaveProperty=debounce((task:Task, path:string, value:any)=>{
        this.props.setTaskProperty({
            task,
            path,
            value,
        });
    },2000);

    handleChange(event) {
        this.setState({textValue: event.target.value});
        this.debounceSaveProperty(this.props.task,this.props.propertyPath,event.target.value);
    }

    render() {
        const {
            props,
        } = this;

        const { caption} = props;
        
        return (
            <div className='task-property-container'>
                <div>{caption}</div>
                <div><input type="text" placeholder={"Enter " + caption} value={this.state.textValue} onChange={this.handleChange.bind(this)}></input></div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setTaskProperty:(payload) => dispatch(setTaskProperty(payload))
    }
}

export default connect(null, mapDispatchToProps)(TaskProperty);