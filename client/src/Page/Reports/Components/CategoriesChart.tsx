import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const CategoriesChart = ({ data }: any) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
        >
          {data.map((_: any, index: number) => (
            <Cell key={index} fill={data[index].color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export const CategoriesList = ({ data }: any) => {
  const total = data.reduce((acc: number, d: any) => acc + d.value, 0);
  
  return (
    <div className="space-y-4">
      {data.map((c: any, i: number) => {
        const percent = ((c.value / total) * 100).toFixed(1);

        return (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: data[i].color }}
                />
                {c.name}
              </span>
              <span className="text-zinc-400">
                {c.value} unidades ({percent}%)
              </span>
            </div>

            <div className="w-full h-2 bg-zinc-800 rounded-full">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${percent}%`,
                  background: data[i].color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};