import axios from "axios";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  RefreshCcw,
  Search,
  Calendar
} from "lucide-react";

import { MovementModal } from "./Components/MovementsModal";

type Product = {
  id: number;
  name: string;
  sku: string;
};

type User = {
  id: number;
  username: string;
};

type Movement = {
  id: number;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason: string;
  timestamp: string;
  product: Product;
  user: User;
};

export const Movements: React.FC = () => {

  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "IN" | "OUT" | "ADJUST">("all");

  const token = localStorage.getItem("token");

  const fetchMovements = async () => {

  const res = await axios.get(
      `${import.meta.env.VITE_API_URL}movements?page=${page}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMovements(res.data.movements);
    setTotalPages(res.data.pagination.totalPages);
    setLoading(false);
  };

  const fetchProducts = async () => {

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}products`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setProducts(res.data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchMovements();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  const filtered = movements.filter((m) => {

    const name = m.product?.name ?? "";
    const sku = m.product?.sku ?? "";

    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      sku.toLowerCase().includes(search.toLowerCase());

    const matchType =
      typeFilter === "all" || m.type === typeFilter;

    return matchSearch && matchType;
  });

  const totalIn = movements
    .filter((m) => m.type === "IN")
    .reduce((a, b) => a + b.quantity, 0);

  const totalOut = movements
    .filter((m) => m.type === "OUT")
    .reduce((a, b) => a + b.quantity, 0);

  const movementsToday = movements.filter((m) => {
    const today = new Date().toDateString();
    return new Date(m.timestamp).toDateString() === today;
  }).length;

  const getMovementStyle = (type: Movement["type"]) => {

    switch (type) {

      case "IN":
        return {
          label: "Entrada",
          color: "bg-emerald-500/15 text-emerald-400",
          icon: <ArrowDown className="w-4 h-4"/>
        };

      case "OUT":
        return {
          label: "Salida",
          color: "bg-orange-500/15 text-orange-400",
          icon: <ArrowUp className="w-4 h-4"/>
        };

      case "ADJUST":
        return {
          label: "Ajuste",
          color: "bg-blue-500/15 text-blue-400",
          icon: <RefreshCcw className="w-4 h-4"/>
        };
    }

  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-semibold">
            Registro de Movimientos
          </h1>

          <p className="text-zinc-400 text-sm">
            Trazabilidad de entradas y salidas de inventario
          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">

          <p className="text-sm text-zinc-400">
            Total Entradas
          </p>

          <p className="text-2xl font-bold text-emerald-400">
            +{totalIn}
          </p>

        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">

          <p className="text-sm text-zinc-400">
            Total Salidas
          </p>

          <p className="text-2xl font-bold text-orange-400">
            -{totalOut}
          </p>

        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">

          <div className="flex items-center gap-2 text-zinc-400 text-sm">

            <Calendar className="w-4 h-4"/>

            Movimientos Hoy

          </div>

          <p className="text-2xl font-bold">
            {movementsToday}
          </p>

        </div>

      </div>

      {/* FILTERS */}

      <div className="flex justify-between">

      <div className="flex gap-4">
          <div className="relative w-80">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>

            <input
              placeholder="Buscar por producto..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />

          </div>

          <select
            value={typeFilter}
            onChange={(e)=>setTypeFilter(e.target.value as any)}
            className="appearance-none px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm pr-8"
          >
            <option value="all">Todos los movimientos</option>
            <option value="IN">Solo entradas</option>
            <option value="OUT">Solo salidas</option>
            <option value="ADJUST">Ajustes</option>
          </select>
        </div>

         <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-lg font-medium"
        >
          + Nuevo Movimiento
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

        {loading ? (
          <p className="p-6">Cargando...</p>
        ) : (

          <table className="w-full">

            <thead className="text-zinc-400 text-sm border-b border-zinc-800">

              <tr>

                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-left">Cantidad</th>
                <th className="p-3 text-left">Motivo</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Fecha</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((m)=>{

                const style = getMovementStyle(m.type);

                return (

                  <tr
                    key={m.id}
                    className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                  >

                    <td className="p-3">

                      <span className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 w-fit ${style?.color}`}>

                        {style?.icon}
                        {style?.label}

                      </span>

                    </td>

                    <td className="p-3">

                      <div className="font-medium">
                        {m.product?.name ?? "Producto eliminado"}
                      </div>

                      <div className="text-xs text-zinc-500">
                        ({m.product?.sku ?? "-"})
                      </div>

                    </td>

                    <td className="p-3 font-medium">

                      {m.type === "IN" && (
                        <span className="text-emerald-400">
                          +{m.quantity}
                        </span>
                      )}

                      {m.type === "OUT" && (
                        <span className="text-orange-400">
                          -{m.quantity}
                        </span>
                      )}

                      {m.type === "ADJUST" && (
                        <span className="text-blue-400">
                          {m.quantity}
                        </span>
                      )}

                    </td>

                    <td className="p-3">
                      {m.reason || "-"}
                    </td>

                    <td className="p-3">

                      <div className="flex items-center gap-2">

                        <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold">

                          {m.user?.username?.[0]?.toUpperCase() ?? "S"}

                        </div>

                        {m.user?.username ?? "Sistema"}

                      </div>

                    </td>

                    <td className="p-3 text-sm text-zinc-500">

                      {new Date(m.timestamp).toLocaleString()}

                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        )}

      </div>

      <div className="flex justify-center gap-2 mt-4">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="px-2 text-sm text-zinc-400">
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
        >
          Siguiente
        </button>

      </div>

      {showModal && (

        <MovementModal
          setShowModal={setShowModal}
          products={products}
          onCreated={fetchMovements}
        />

      )}

    </div>
  );
};