import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export const SalesChart = ({data, period}:any) => {

  return (

    <ResponsiveContainer width="100%" height={350}>

      <AreaChart data={data}>

        <defs>

          <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">

            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>

            <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>

          </linearGradient>

        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>

        <XAxis dataKey="label" stroke="#71717a"/>

        <YAxis stroke="#71717a"/>

        <Tooltip
          formatter={(value: any, name: any) => {
              if (!name) return [value, ""];

              if (name === "Ingresos") {
                return [`$${Number(value).toLocaleString("es-AR")}`, name];
              }

              if (name === "Ventas") {
                return [Number(value).toLocaleString("es-AR"), name];
              }

              return [value, name];
            }}
          labelFormatter={(label:any) => {
            if (period === "day") return `Día: ${label}`;
            if (period === "month") return `Mes: ${label}`;
            if (period === "year") return `Año: ${label}`;
            return label;
          }}
          contentStyle={{
            background:"#18181b",
            border:"1px solid #27272a",
            borderRadius:"8px"
          }}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          name="Ingresos"
          stroke="#10b981"
          fill="url(#sales)"
          strokeWidth={2}
          isAnimationActive={true}
          />

        <Area
          type="monotone"
          dataKey="sales"
          name="Ventas"
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth={2}
          isAnimationActive={true}
        />

      </AreaChart>

    </ResponsiveContainer>

  )

}