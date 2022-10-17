import { Bar, BarChart, Tooltip, XAxis } from 'recharts';
import './histogram.css';

export interface HistogramProps {
    data:{title:string,value:number}[];
}

function DataHistogram(props:HistogramProps):JSX.Element {
    const { data } = props;
    return (<div className='histogram-container'>
        <BarChart data={data} width={100} height={35}>
            <XAxis dataKey="title" axisLine={false} tickLine={false} hide={true}/>
            <Tooltip />
            
            <Bar dataKey="value" fill="#333695" />
        </BarChart>
    </div>)
}

export default DataHistogram