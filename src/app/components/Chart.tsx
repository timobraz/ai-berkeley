import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "2020",
    carbon: 3908,
  },
  {
    name: "2021",
    carbon: 4800,
  },
  {
    name: "2022",
    carbon: 3800,
  },
  {
    name: "2023",
    carbon: 4300,
  },
];
interface ExampleProps {
  data: any[]; // replace any with the type of your data
}
export default class Example extends PureComponent<ExampleProps> {
  static demoUrl =
    "https://codesandbox.io/p/sandbox/line-chart-width-xaxis-padding-8v7952";

  render() {
    const data = [
      {
        name: "2020",
        carbon: this.props.data[0],
      },
      {
        name: "2021",
        carbon: this.props.data[1],
      },
      {
        name: "2022",
        carbon: this.props.data[2],
      },
      {
        name: "2023",
        carbon: this.props.data[3],
      },
    ];
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="carbon"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
