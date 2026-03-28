import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

export const TopProductsChart = ({ data }: any) => {

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        barSize={50}
      >

        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

        <XAxis type="number" stroke="#71717a"  />

        <YAxis
          type="category"
          dataKey="name"
          stroke="#71717a"
          width={150}
        />

        <Tooltip
          formatter={(value: any) => [
            Number(value).toLocaleString("es-AR"),
            "Unidades"
          ]}
          contentStyle={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px"
          }}
        />

        <Bar
          dataKey="value"
          fill="#3b82f6"
          radius={[0, 6, 6, 0]}
        />

      </BarChart>
    </ResponsiveContainer>
  );
};