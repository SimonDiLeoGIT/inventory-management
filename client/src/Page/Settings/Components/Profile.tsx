import { Save } from "lucide-react"
import { useState } from "react";
import { useAuth } from "../../../Hooks/useAuth";
import axios from "axios";

export const Profile = () => {

  const { user } = useAuth();

  const token = localStorage.getItem("token");
  
  const [form, setForm] = useState({
    name: user?.username,
    email: user?.email,
    roles: user?.roles
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}users/me`,
      {
        name: form.name,
        email: form.email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Perfil actualizado");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-white">
          Información del Perfil
        </h2>
        <p className="text-zinc-400 text-sm">
          Actualiza tu información personal
        </p>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="text-sm text-zinc-400">
            Nombre completo
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled
            className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>

      {/* ROLE */}
      <div>
        <label className="text-sm text-zinc-400">
          Rol
        </label>
        <input
          type="text"
          value={`${form.roles?.join(", ")}`}
          disabled
          className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400"
        />
      </div>

      {/* BUTTON */}
      <div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Save size={16}/>
          Guardar cambios
        </button>
      </div>
    </div>
  )
}