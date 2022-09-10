import './datapreview.css';

import columnIcon from './columnIcon.png';
import DataHistogram from './histogram';

export interface IDataPreviewProps {
    data:any[];
}

function DataPreview(props:IDataPreviewProps):JSX.Element {
    const {data} = props;

    if (!data || !data.length) return null;

    const cols = Object.keys(props.data[0]);

    const columnHeaders = cols.map((c)=>
    <th className='data-column-header'>
        <div>
            <img src={columnIcon} className='data-column-header-icon'></img>
        </div>
        <div className='data-column-header-text'>{c}</div>
    </th>
    );

    const histograms = cols.map((c)=>{
        const rnd = Array.from({length: 10}, () => Math.floor(Math.random() * 10))
        return (<td>
            <DataHistogram data={rnd}></DataHistogram>
        </td>)
    });

    const datarows = data.map((d)=><tr>
        {cols.map((c)=><td className='data-cell'>
            <span className='body-text'>{d[c]}</span>
            </td>)}
    </tr>)

    return (<div className="data-preview-container">
        <table>
            <thead>
                {columnHeaders}
            </thead>
            <tbody>
                <tr>{histograms}</tr>
                {datarows}
            </tbody>
        </table>
    </div>);
}

export default DataPreview;