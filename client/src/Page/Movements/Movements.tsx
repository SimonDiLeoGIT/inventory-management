import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { MovementModal } from "./Components/MovementsModal";

type Product = {
  id: number;
  name: string;
  sku: string;
};

type User = {
  id: number;
  name: string;
};

type Movement = {
  id: number;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason: string;
  timestamp: string;
  Product: Product;
  User?: User;
};

export const Movements: React.FC = () => {

  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "IN" | "OUT" | "ADJUST">("all");

  const token = localStorage.getItem("token");

  const fetchMovements = async () => {

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}movements`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMovements(res.data.movements);
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
    fetchMovements();
    fetchProducts();
  }, []);

  const filtered = movements.filter((m) => {

    const matchSearch =
      m.Product.name.toLowerCase().includes(search.toLowerCase()) ||
      m.Product.sku?.toLowerCase().includes(search.toLowerCase());

    const matchType =
      typeFilter === "all" || m.type === typeFilter;

    return matchSearch && matchType;
  });

  return (
    <div className="h-full">

      <div className="flex justify-between items-center mb-4">

        <div>
          <h1 className="text-2xl font-bold">
            Registro de Movimientos
          </h1>
          <p className="text-sm text-zinc-400">
            Trazabilidad de entradas y salidas de inventario
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          + Nuevo Movimiento
        </button>

      </div>

      {/* filtros */}

      <div className="flex gap-4 mb-4">

        <div className="relative w-72">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

          <input
            placeholder="Buscar por producto..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          />

        </div>

        <select
          value={typeFilter}
          onChange={(e)=>setTypeFilter(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
        >
          <option value="all">Todos</option>
          <option value="IN">Entradas</option>
          <option value="OUT">Salidas</option>
          <option value="ADJUST">Ajustes</option>
        </select>

      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800/40 shadow rounded-lg overflow-hidden border border-zinc-400">

        {loading ? (
          <p className="p-6">Cargando...</p>
        ) : (

          <table className="w-full">

            <thead className="bg-zinc-200/50 dark:bg-zinc-700">

              <tr>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Producto</th>
                <th className="p-2 text-left">Cantidad</th>
                <th className="p-2 text-left">Motivo</th>
                <th className="p-2 text-left">Usuario</th>
                <th className="p-2 text-left">Fecha</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((m)=>{

                const isIn = m.type === "IN";

                return (

                  <tr
                    key={m.id}
                    className="border-t hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                  >

                    <td className="p-2">

                      <span className={`px-3 py-1 rounded text-sm flex items-center gap-2 w-fit ${
                        isIn
                          ? "bg-emerald-600/20 text-emerald-400"
                          : "bg-orange-600/20 text-orange-400"
                      }`}>

                        {isIn
                          ? <ArrowDown className="w-4 h-4"/>
                          : <ArrowUp className="w-4 h-4"/>
                        }

                        {isIn ? "Entrada" : "Salida"}

                      </span>

                    </td>

                    <td className="p-2">
                      {m.Product.name}
                      <br/>
                      <span className="text-xs text-zinc-400">
                        ({m.Product.sku})
                      </span>
                    </td>

                    <td className={`p-2 font-medium ${
                      isIn
                        ? "text-emerald-400"
                        : "text-orange-400"
                    }`}>
                      {isIn ? "+" : "-"}{m.quantity}
                    </td>

                    <td className="p-2">
                      {m.reason}
                    </td>

                    <td className="p-2">
                      {m.User?.name ?? "Sistema"}
                    </td>

                    <td className="p-2 text-sm text-zinc-400">
                      {new Date(m.timestamp).toLocaleString()}
                    </td>

                  </tr>

                )
              })}

            </tbody>

          </table>

        )}

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