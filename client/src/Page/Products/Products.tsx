import axios from "axios";
import { useEffect, useState } from "react";
import { Trash, Edit, Search } from "lucide-react";
import { ProductModal } from "./Components/ProductModal";

type Category = {
  id: number;
  name: string;
  color: string;
};

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
  category?: Category;
};

export const Products: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    categoryId: 0,
    salePrice: 0,
    cost: 0,
    stock: 0,
    minStock: 0
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const params: any = {
      page,
      limit: 8
    };

    if (search) params.search = search;

    if (categoryFilter !== "all") {
      params.categoryId = categoryFilter;
    }

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}products`,
      {
        params,
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setProducts(res.data.products);
    setTotalPages(res.data.pagination.totalPages);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}categories`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setCategories(res.data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryFilter]);

  const createProduct = async () => {

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}products`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.data.success) {
      alert("Error al crear producto");
      return;
    }

    setShowModal(false);
    fetchProducts();
  };

  const updateProduct = async () => {

    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}products/${editingId}`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.data.success) {
      alert("Error al actualizar producto");
      return;
    }

    setShowModal(false);
    setEditingId(null);
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {

    if (!confirm("Eliminar producto?")) return;

    await axios.delete(
      `${import.meta.env.VITE_API_URL}products/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchProducts();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Gestión de Productos
          </h1>
          <p className="text-zinc-400 text-sm">
            Administra tus productos
          </p>
        </div>

      </div>

      {/* FILTROS */}

      <div className="flex justify-between gap-4">

        <div className="flex gap-4">

          {/* BUSCADOR */}

          <div className="relative w-72">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>

            <input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />

          </div>

          {/* FILTRO CATEGORÍA */}

          <select
            value={categoryFilter}
            onChange={(e) => {
              const value =
                e.target.value === "all"
                  ? "all"
                  : Number(e.target.value);

              setCategoryFilter(value);
              setPage(1);
            }}
            className="appearance-none px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm pr-8"
          >

            <option value="all">
              Todas las categorías
            </option>

            {categories.map((cat) => (

              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>

            ))}

          </select>

        </div>

        {/* BOTÓN NUEVO */}

        <button
          onClick={() => {

            setEditingId(null);

            setForm({
              name: "",
              sku: "",
              description: "",
              categoryId: 0,
              salePrice: 0,
              cost: 0,
              stock: 0,
              minStock: 0
            });

            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-lg font-medium"
        >
          + Nuevo producto
        </button>

      </div>

      {/* TABLA */}

      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

        {loading ? (
          <p className="p-6">Cargando...</p>
        ) : (

          <table className="w-full">

            <thead className="text-zinc-400 text-sm border-b border-zinc-800">

              <tr>

                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Producto</th>
                <th className="text-left p-3">SKU</th>
                <th className="text-left p-3">Categoría</th>
                <th className="text-left p-3">Costo</th>
                <th className="text-left p-3">Precio</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-right p-3 pr-8">Acciones</th>

              </tr>

            </thead>

            <tbody>

              {products.map((product) => (

                <tr
                  key={product.id}
                  className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                  style={{
                    backgroundColor:
                      product.stock <= product.minStock
                        ? "rgba(239,68,68,0.08)"
                        : ""
                  }}
                >

                  <td className="p-3">
                    {product.id}
                  </td>

                  <td className="p-3">

                    <div className="font-medium">
                      {product.name}
                    </div>

                    <div className="text-xs text-zinc-500">
                      {product.description}
                    </div>

                  </td>

                  <td className="p-3">
                    {product.sku}
                  </td>

                  <td className="p-3">

                    <div className="flex items-center gap-2">

                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: product.category?.color }}
                      />

                      {product.category?.name}

                    </div>

                  </td>

                  <td className="p-3">
                    ${product.cost}
                  </td>

                  <td className="p-3">
                    ${product.salePrice}
                  </td>

                  <td
                    className={`p-3 font-medium ${
                      product.stock <= product.minStock
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {product.stock}

                    <span className="text-xs text-zinc-400 ml-1">
                      / {product.minStock}
                    </span>

                  </td>

                  <td className="p-3 text-right space-x-2">

                    <button
                      onClick={() => {

                        setEditingId(product.id);

                        setForm({
                          name: product.name,
                          sku: product.sku,
                          description: product.description,
                          categoryId: product.categoryId,
                          salePrice: product.salePrice,
                          cost: product.cost,
                          stock: product.stock,
                          minStock: product.minStock
                        });

                        setShowModal(true);
                      }}
                      className="px-3 py-1 rounded text-zinc-900 dark:text-zinc-200 hover:bg-emerald-600"
                    >
                      <Edit className="w-4 h-4"/>
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="px-3 py-1 rounded text-red-600 hover:bg-red-800"
                    >
                      <Trash className="w-4 h-4"/>
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* PAGINACIÓN */}

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

        <ProductModal
          setShowModal={setShowModal}
          form={form}
          setForm={setForm}
          categories={categories}
          onSubmit={editingId ? updateProduct : createProduct}
        />

      )}

    </div>
  );
};