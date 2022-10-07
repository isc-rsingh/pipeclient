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
        const rnd = Array.from({length: 10}, () => Math.floor(Math.random() * 10))
        return (<td key={'hist' + c}>
            <DataHistogram data={rnd}></DataHistogram>
        </td>)
    });

    const datarows = data.map((d,idx)=><tr key={'row' + idx}>
        {cols.map((c)=><td className='data-cell' key={'col' + c + 'row' + idx}>
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