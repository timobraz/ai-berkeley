import React, { PureComponent } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
interface ExampleProps {
  data: number[];
}
export default function MyRadar(props: ExampleProps) {
  const data = [
    {
      subject: "Energy",
      A: props.data[0],
      fullMark: 150,
    },
    {
      subject: "Scope 1",
      A: props.data[1],
      fullMark: 150,
    },
    {
      subject: "Scope 2",
      A: props.data[2],
      fullMark: 150,
    },
    {
      subject: "Scope 3",
      A: props.data[3],

      fullMark: 150,
    },
    {
      subject: "Water",
      A: props.data[4],

      fullMark: 150,
    },
    {
      subject: "Waste",
      A: props.data[5],

      fullMark: 150,
    },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%" className="">
      <RadarChart cx="50%" cy="50%" outerRadius="40%" data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          stroke="white"
          fontWeight={600}
          fontSize={15}
        />
        <Radar
          name="Mike"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
