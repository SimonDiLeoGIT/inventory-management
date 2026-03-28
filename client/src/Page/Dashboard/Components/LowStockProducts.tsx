import { TriangleAlert } from "lucide-react";

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
};

interface Props {
  products: Product[];
}

export const LowStockProducts: React.FC<Props> = ({ products }) => {
  return (
    <div className="bg-zinc-900 border border-red-900/40 rounded-xl p-5">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4 text-red-500">
        <span className="text-lg"><TriangleAlert /></span>
        <h2 className="text-sm font-semibold">
          Alertas de Stock Bajo
        </h2>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {products.map((product) => {
          const isCritical = product.stock === 0;

          return (
            <div
              key={product.id}
              className="flex items-center justify-between bg-zinc-800/60 hover:bg-zinc-800 transition rounded-lg px-4 py-3 border border-zinc-800"
            >
              {/* IZQUIERDA */}
              <div className="flex items-center gap-3">
                
                {/* Avatar letra */}
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-700 text-xs font-bold text-white">
                  {product.name.charAt(0)}
                </div>

                <div>
                  <p className="text-sm text-white font-medium">
                    {product.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    SKU: {product.sku}
                  </p>
                </div>
              </div>

              {/* DERECHA */}
              <div className="text-right flex items-center gap-3">
                
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isCritical ? "text-red-500" : "text-white"
                    }`}
                  >
                    {product.stock} unidades
                  </p>
                  <p className="text-xs text-zinc-500">
                    Min: {product.minStock}
                  </p>
                </div>

                {/* BADGE */}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isCritical
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {isCritical ? "Sin stock" : "Crítico"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="text-center text-zinc-500 py-10 text-sm">
          No hay productos con stock bajo
        </div>
      )}
    </div>
  );
};