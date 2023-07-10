import React from 'react'
import "./chart.scss"
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";
const data = [
    {name:"Monday",Sale:120,View:10},
    {name:"Tuesday",Sale:200,View:150},
    {name:"Wednesday",Sale:280,View:190},
    {name:"Thirsday",Sale:321,View:500},
    {name:"Friday",Sale:58,View:380},
    {name:"Saturday",Sale:0,View:100},
    {name:"Sunday",Sale:100,View:40},
];

const Chart = () => {
  return (
    <div className='chart'>
        <div className="title">Previous 7 Day Sales</div>
        <ResponsiveContainer width="100%" height="90%">
            <AreaChart width={730} height={250} data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="sale" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="view" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke='gray' />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" className='chartGrid'/>
                    <Tooltip />
                    <Area type="monotone" dataKey="Sale" stroke="#8884d8" fillOpacity={1} fill="url(#sale)" />
                    <Area type="monotone" dataKey="View" stroke="#82ca9d" fillOpacity={1} fill="url(#view)" />
            </AreaChart>


      </ResponsiveContainer>
    </div>
  )
}

export default Chart