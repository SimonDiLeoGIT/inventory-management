import axios from "axios";
import { useEffect, useState } from "react";
import { Trash, Edit } from "lucide-react";
import { CategoryModal } from "./Components/CategoryModal";

type Category = {
  id: number;
  name: string;
  description: string;
  color: string;
};

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#6366f1"
  });
  const [editingId, setEditingId] = useState<number|null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCategories(response.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    try {
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

    } catch (err) {
      console.error(err);
    }
  };

  const updateCategory = async () => {
    try {
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

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>

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
          className="bg-emerald-600 dark:bg-emerald-800 px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          + Nueva categoría
        </button>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800/40 shadow rounded-lg overflow-hidden border border-zinc-400">
        {loading ? (
          <p className="p-6">Cargando...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-200/50 dark:bg-zinc-700">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Descripción</th>
                <th className="text-left p-3">Color</th>
                <th className="text-right p-3 pr-24">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categories?.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-zinc-200 dark:border-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors duration-300"
                >
                  <td className="p-3">{category.id}</td>

                  <td className="p-3 font-medium">
                    {category.name}
                  </td>

                  <td className="p-3 text-zinc-600 dark:text-zinc-400">
                    {category.description}
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
                      className="px-3 py-1 rounded text-red-600 dark:text-red-600 hover:bg-red-800"
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