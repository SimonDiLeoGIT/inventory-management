import axios from "axios";
import { useState } from "react";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  products: { id:number; name:string; sku:string }[];
  onCreated: () => void;
}

export const MovementModal: React.FC<Props> = ({
  setShowModal,
  products,
  onCreated
}) => {

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    productId: 0,
    type: "IN",
    quantity: 1,
    reason: ""
  });

  const createMovement = async () => {

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}movements`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.data.success) {
      alert("Error al crear movimiento");
      return;
    }

    setShowModal(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-600 rounded-xl w-110 p-6">

        <h2 className="text-xl font-bold mb-4">
          Nuevo Movimiento
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Producto
            </label>
            <select
              value={form.productId}
              onChange={(e)=>setForm({...form,productId:Number(e.target.value)})}
              className="w-full border p-2 rounded"
            >
              <option value={0}>Seleccionar producto</option>

              {products.map(p=>(
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}

            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de movimiento
            </label>
            <select
              value={form.type}
              onChange={(e)=>setForm({...form,type:e.target.value})}
              className="w-full border p-2 rounded"
            >
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
              <option value="ADJUST">Ajuste</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Cantidad
            </label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e)=>setForm({...form,quantity:Number(e.target.value)})}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Motivo
            </label>
            <textarea
              placeholder="Ej: reposición de stock"
              value={form.reason}
              onChange={(e)=>setForm({...form,reason:e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={()=>setShowModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={createMovement}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Guardar
          </button>

        </div>

      </div>

    </div>
  );
};