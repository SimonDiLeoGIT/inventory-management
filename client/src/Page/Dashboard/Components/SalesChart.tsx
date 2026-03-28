import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export const SalesChart = ({ data }: any) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data.data}>

        <defs>
          <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#27272a"  />

        <XAxis dataKey="label" stroke="#71717a" tick={{ fontSize: 12 }} />

        {/* EJE IZQUIERDO (Ventas) */}
        <YAxis
          yAxisId="left"
          // stroke="#3b82f6"
          stroke="#71717a"
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          />

        {/* EJE DERECHO (Ingresos) */}
        <YAxis
          yAxisId="right"
          orientation="right"
          // stroke="#10b981"
          tickFormatter={(value) =>
            `$${value.toLocaleString("es-AR")}`
          }
          tick={{ fontSize: 12 }}
        />

        <Tooltip
          formatter={(value: any, name: any) => {
            if (name === "Ingresos") {
              return [`$${Number(value).toLocaleString("es-AR")}`, name];
            }
            if (name === "Ventas") {
              return [Number(value).toLocaleString("es-AR"), name];
            }
            return [value, name];
          }}
          contentStyle={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />

        {/* Revenue */}
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          name="Ingresos"
          stroke="#10b981"
          fill="url(#revenue)"
          strokeWidth={2}
        />

        {/* Sales */}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="sales"
          name="Ventas"
          stroke="#3b82f6"
          fill="transparent"
          strokeWidth={2}
        />

      </AreaChart>
    </ResponsiveContainer>
  );
};