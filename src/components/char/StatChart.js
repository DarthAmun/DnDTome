import React from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export default function StatChart(props) {
    return (
        <RadarChart cx={100} cy={70} outerRadius={40} width={220} height={140} data={props.data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8000ff' }} />
            <PolarRadiusAxis angle={90} domain={[0, "dataMax"]} axisLine={false} tick={false} />
            <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
    );
}
