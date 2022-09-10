import { Bar, BarChart } from 'recharts';
import './histogram.css';

export interface HistogramProps {
    data:number[];
}

function DataHistogram(props:HistogramProps):JSX.Element {
    const { data } = props;
    return (<div className='histogram-container'>
        <BarChart data={data} width={100} height={35}>
            <Bar dataKey={(v) => v} fill="#333695" />
        </BarChart>
    </div>)
}

export default DataHistogram