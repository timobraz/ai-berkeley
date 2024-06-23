import React, { PureComponent } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const data = [
  {
    subject: "Environment",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "Social",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Governance",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Carbon",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "Gas",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "Electricity",
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

export default function MyRadar() {
  return (
    <ResponsiveContainer width="100%" height="100%" className="">
      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" stroke="white" fontWeight={600} fontSize={15} />
        {/* <PolarRadiusAxis stroke="brown" /> */}
        <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
