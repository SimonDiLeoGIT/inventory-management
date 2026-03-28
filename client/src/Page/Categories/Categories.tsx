import axios from "axios";
import { useEffect, useState } from "react";
import { Trash, Edit, Search } from "lucide-react";
import { CategoryModal } from "./Components/CategoryModal";

type Category = {
  id: number;
  name: string;
  description: string;
  color: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const Categories: React.FC = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#6366f1"
  });

  const fetchCategories = async (pageNumber = page, searchTerm = search) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}categories`,
        {
          params: {
            page: pageNumber,
            search: searchTerm,
            limit: 10
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCategories(response.data.categories);
      setPagination(response.data.pagination);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  const deleteCategory = async (id: number) => {

    if (!confirm("Eliminar categoría?")) return;

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.data.success) {
      alert("Error al eliminar categoría");
      return;
    }

    fetchCategories();
  };

  const createCategory = async () => {

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}categories`,
      form,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    if (!response.data.success) {
      alert("Error al crear categoría");
      return;
    }

    setShowModal(false);

    setForm({
      name: "",
      description: "",
      color: "#6366f1"
    });

    fetchCategories();
  };

  const updateCategory = async () => {

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}categories/${editingId}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    if (!response.data.success) {
      alert("Error al actualizar categoría");
      return;
    }

    setShowModal(false);
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      color: "#6366f1"
    });

    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Categorías</h1>
          <p className="text-zinc-400 text-sm">
            Administra las categorías de tus productos
          </p>

        </div>
      </div>

      {/* BUSCADOR */}

      <div className="flex gap-4 justify-between">

        <div className="relative w-80">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>

          <input
            placeholder="Buscar por producto..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />

        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              name: "",
              description: "",
              color: "#6366f1"
            });
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-lg font-medium"
        >
          + Nueva categoría
        </button>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

        {loading ? (
          <p className="p-6">Cargando...</p>
        ) : (

          <table className="w-full">

            <thead className="text-zinc-400 text-sm border-b border-zinc-800">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Color</th>
                <th className="text-right p-3 pr-8">Acciones</th>
              </tr>
            </thead>

            <tbody>

              {categories.map((category) => (

                <tr
                  key={category.id}
                  className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                >

                  <td className="p-3">{category.id}</td>

                  <td className="p-3">
                    <div className="font-medium">
                    {category.name}
                    </div>
                    <div className="text-zinc-500 text-sm">
                    {category.description}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full opacity-70"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {category.color}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-right space-x-2">

                    <button
                      className="px-3 py-1 rounded text-zinc-900 dark:text-zinc-200 hover:bg-emerald-600"
                      onClick={() => {
                        setEditingId(category.id);
                        setForm({
                          name: category.name,
                          description: category.description,
                          color: category.color
                        });
                        setShowModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="px-3 py-1 rounded text-red-600 hover:bg-red-800"
                    >
                      <Trash className="w-4 h-4" />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}
      </div>

      {/* PAGINACIÓN */}

      {pagination && (
          <div className="flex justify-center gap-2 mt-4">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="px-2 text-sm text-zinc-400">
            Página {pagination.page} de {pagination.totalPages}
          </span>

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
          >
            Siguiente
          </button>

        </div>
      )}

      {showModal &&
        <CategoryModal
          setShowModal={setShowModal}
          form={form}
          setForm={setForm}
          onSubmit={editingId ? updateCategory : createCategory}
        />
      }

    </div>
  );
};