import { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, ShoppingCart } from "lucide-react";
import { CategoriesChart, CategoriesList } from "./Components/CategoriesChart";
import { SalesChart } from "./Components/SalesChart";
import { TopProductsChart } from "./Components/TopProductsChart";
import { Card } from "../../Components/Cards/Card";

type Summary = {
  revenue: number;
  totalSales: number;
  avgTicket: number;
  peakHour: string;
};

export const Reports = () => {

  const [summary,setSummary] = useState<Summary | null>(null);
  const [activeTab,setActiveTab] = useState("sales");
  const [period, setPeriod] = useState<"day" | "month" | "year">("day");
  const [salesEvolution,setSalesEvolution] = useState<any[]>([]);
  const [topProducts,setTopProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [date] = useState(new Date());
  
  const token = localStorage.getItem("token");

  const fetchSummary = async () => {

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}reports/sales-summary`,
      {
        params:{ period },
        headers:{ Authorization:`Bearer ${token}` }
      }
    );

    setSummary(res.data.data);
  };

  const fetchSalesEvolution = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}reports/sales-evolution`,
      {
        params: {
          period,
          date: date.toISOString()
        },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    setSalesEvolution(res.data.data);
  };

  useEffect(() => {
    fetchSummary();

    if (activeTab === "sales") {
      fetchSalesEvolution();
    }

    if (activeTab === "products") {
      fetchTopProducts();
    }

    if (activeTab === "categories") {
      fetchCategories();
    }

  }, [period, date, activeTab]);

  const fetchTopProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}reports/top-products`,
        {
          params: {
            period,
            date: date.toISOString()
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setTopProducts(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}reports/sales-by-category`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (value:number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Análisis de Ventas
          </h1>
          <p className="text-zinc-400 text-sm">
            Visualiza el rendimiento de tu negocio
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <Card
          title="Ingresos Totales"
          value={formatCurrency(summary?.revenue ?? 0)}
          icon={<DollarSign/>}
          color="bg-emerald-500/20 text-emerald-400"
        />
        <Card
          title="Ventas Totales"
          value={summary?.totalSales ?? 0}
          icon={<ShoppingCart/>}
          color="bg-blue-500/20 text-blue-400"
        />
      </div>

      {/* TABS */}
      <div className="flex justify-between w-full">
        <div className="flex gap-2 bg-zinc-800 p-1 rounded-lg w-fit">
          {[
            {id:"sales",label:"Ventas"},
            {id:"products",label:"Productos"},
            // {id:"hours",label:"Horarios"},
            {id:"categories",label:"Categorías"}
          ].map((tab)=>{  
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={()=>setActiveTab(tab.id)}
              className={`
                px-4 py-1 rounded-md text-sm
                ${active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-400 hover:text-white"
                }
                `}
                >
              {tab.label}
            </button>
          );
          })}
        </div>
        {/* FILTROS */}
        {activeTab === "sales" && (
          <div className="flex gap-2">
            {["day","month","year"].map((p)=>{
              const active = period === p;
              return (  
                <button
                key={p}
                onClick={()=>setPeriod(p as "day" | "month" | "year")}
                  className={`
                    px-3 py-1 rounded-md text-sm
                    ${active
                      ? "bg-emerald-500 text-black"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    }
                  `}
                  >
                  {p === "day" && "Día"}
                  {p === "month" && "Mes"}
                  {p === "year" && "Año"}
                </button>
                );
              })}
          </div>
        )}
      </div>

      {/* CHART */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-xs">
        {activeTab === "products" && (
          <>
            <h2 className="text-sm text-zinc-400 mb-4">
              Top Productos
            </h2>
            <TopProductsChart
              data={topProducts.map((p) => ({
                name: p.product?.name,
                value: p.total
              }))}
            />
          </>
        )}

        {activeTab === "sales" && (
          <>
            <h2 className="text-sm text-zinc-400 mb-4">
              Evolución de Ventas
            </h2>
            {salesEvolution.length === 0 ? (
              <div className="text-center text-zinc-500 py-20">
                No hay datos para este período
              </div>
            ) : (
              <SalesChart data={salesEvolution} period={period} />
            )}
          </>
        )}

        {activeTab === "categories" && (
          <>
            <h2 className="text-sm text-zinc-400 mb-4">
              Categorías
            </h2>

            <div className="grid grid-cols-2 gap-6">
              
              <div className="bg-zinc-900 rounded-xl p-4">
                <h3 className="text-xs text-zinc-400 mb-4">
                  Distribución por Categoría
                </h3>

                <CategoriesChart data={categories} />
              </div>

              <div className="bg-zinc-900 rounded-xl p-4">
                <h3 className="text-xs text-zinc-400 mb-4">
                  Detalle por Categoría
                </h3>

                <CategoriesList data={categories} />
              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
};
