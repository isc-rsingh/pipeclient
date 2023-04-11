import './datapreview.css';

import columnIcon from './columnIcon.png';
import DataHistogram from './histogram';
import { Task } from '../../models/task';
import { Pipeline } from '../../models/pipeline';
import { useSelector } from 'react-redux';
import { taskHelper } from '../../services/taskHelper';

import { ReactComponent as IntIcon } from "../../assets/icons/type_int123_dtyoe.svg";
import { ReactComponent as VarcharIcon } from '../../assets/icons/type_varchar_dtype.svg';
import { ReactComponent as GenericIcon } from '../../assets/icons/type_generic.svg';


export interface IDataPreviewProps {
    data:any[];
    task:Task;
}

function DataPreview(props:IDataPreviewProps):JSX.Element {
    const {data} = props;
    const pipeline: Pipeline = useSelector((state:any)=>state.pipelineEditor.value);

    if (!data || !data.length) return null;

    const fields = taskHelper.getFieldsForTask(pipeline,props.task.taskid);

    const cols = Object.keys(props.data[0]);

    function getIconForColumn(colName) {
        const colDef = fields.find(f=>f.name === colName);
        if (colDef) {
        switch (colDef.type) {
                case "VARCHAR":
                    return (<VarcharIcon className='data-column-header-icon' />)
                case "INTEGER":
                case "BIGINT":
                    return (<IntIcon className='data-column-header-icon' />)
            }
        }

        return <GenericIcon className='data-column-header-icon' />
    }

    const getIconForColumnBound = getIconForColumn.bind(this);

    const columnHeaders = cols.map((c)=>
    <th className='data-column-header' key={'colhead' + c}>
        <div>
            {getIconForColumnBound(c)}
        </div>
        <div className='data-column-header-text'>{c}</div>
    </th>
    );

    const histograms = cols.map((c)=>{
        const stats = taskHelper.getStatisticsForColumn(pipeline, props.task.taskid, c);
        let data;
        if (stats && stats.bins) {
            console.log("getting stats from bins for "+stats.property)
            data = stats.bins.map((s:any)=> {return {value:s.value, title:`${s.left} thru ${s.right}`};});
        } else if (stats && stats.counts) {
            console.log("getting stats from counts for "+stats.property)
            data = []
            for (var key in stats.counts) {
                if (stats.counts.hasOwnProperty(key) && key.length>0) 
                    data.push({value:stats.counts[key], title: key})
            }
        } 
        
        if (!data) {
            // data = Array.from({length: 10}, () => Math.floor(Math.random() * 10)) 
            // data = data.map((d,idx)=>{return {title:(idx+1),value:d};});
            return (<div />);
        }

        return (<td key={'hist' + c}>
            <DataHistogram data={data}></DataHistogram>
        </td>)
    });

    const datarows = data.map((d,idx)=><tr key={'row' + idx}>
        {cols.map((c)=><td className={`data-cell ${(idx +1) % 2  && 'alt-row'}`} key={'col' + c + 'row' + idx}>
            <span className='body-text'>{d[c]}</span>
            </td>)}
    </tr>)

    return (<div className="data-preview-container">
        <table>
            <thead>
                <tr>
                    {columnHeaders}
                </tr>
            </thead>
            <tbody>
                <tr>{histograms}</tr>
                {datarows}
            </tbody>
        </table>
    </div>);
}

export default DataPreview;