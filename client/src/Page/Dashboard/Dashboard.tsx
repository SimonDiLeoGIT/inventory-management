import { useEffect, useState } from "react";
import { Card } from "../../Components/Cards/Card";
import axios from "axios";
import { ArrowRightLeft, CircleDollarSign, Folder, Package, TriangleAlert } from "lucide-react";
import { LowStockProducts } from "./Components/LowStockProducts";
import { SalesChart } from "./Components/SalesChart";
import { TopProductsChart } from "./Components/TopProductsChart";

type dashboardData = {
  summary: Summary;
  lowStock: Product[];
  weekSalesEvolution: {
    data: Sale[]
    weekSales: number
    weekRevenue: number
  }
  topProducts: TopProduct[];
  // categories: any[];
}

type Summary = {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  todayMovements: number;
  inventoryValue: number;
}

type Product = {
  id: number;
  name: string;
  sku: string;
  description: string;
  categoryId: number;
  salePrice: number;
  cost: number;
  stock: number;
  minStock: number;
  // category?: Category;
}

type Sale = {
  date: string;
  sales: number;
  revenue: number;
}

type TopProduct = {
  productId: number;
  total: number;
  name: string;
}

export const Dashboard = () => {

  const [data, setData] = useState<dashboardData | null>(null);

  const token = localStorage.getItem("token");
  const fetchDashboard = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}dashboard`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    setData(res.data.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatCurrency = (value:number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
  }).format(value);

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-5 gap-2">
        <Card
          title="Total Productos"
          value={data?.summary?.totalProducts ?? 0}
          icon={<Package/>}
          color="bg-emerald-500/20 text-emerald-400"
        />
        <Card
          title="Categorías"
          value={data.summary?.totalCategories ?? 0}
          icon={<Folder />}
          color="bg-blue-500/20 text-blue-400"
        />
        <Card
          title="Bajo Stock"
          value={data.summary?.lowStockProducts ?? 0}
          icon={<TriangleAlert />}
          color="bg-rose-500/20 text-rose-400"
        />
        <Card
          title="Movimientos Hoy"
          value={data.summary?.todayMovements ?? 0}
          icon={<ArrowRightLeft />}
          color="bg-orange-500/20 text-orange-400"
        />
        <Card
          title="Valor Inventario"
          value={formatCurrency(data.summary?.inventoryValue ?? 0)}
          icon={<CircleDollarSign />}
          color="bg-violet-500/20 text-violet-400"
        />
      </div>
      <LowStockProducts products={data.lowStock} />
      <section className="grid grid-cols-2 gap-4">
        <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">
            Ventas de la Semana
          </h2>
          <SalesChart data={data.weekSalesEvolution} />
          <div className="flex justify-between text-xs mt-4 text-zinc-400">
            <p>Total Ventas: <span className="text-emerald-400 font-semibold">{data.weekSalesEvolution.weekSales}</span></p>
            <p>Ingresos: <span className="text-emerald-400 font-semibold">{formatCurrency(data.weekSalesEvolution.weekRevenue)}</span></p>
          </div>
        </article>
        <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">
            Productos Mas Vendidos
          </h2>
          <TopProductsChart
            data={data.topProducts
              .map((p: any) => ({
                name: p.name,
                value: Number(p.total)
              }))
              .sort((a, b) => b.value - a.value)
            }
         />
        </article>
      </section>
    </div>
  );
}