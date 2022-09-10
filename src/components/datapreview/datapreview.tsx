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
    <th className='data-column-header' key={'colhead' + c}>
        <div>
            <img src={columnIcon} className='data-column-header-icon' alt=""></img>
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