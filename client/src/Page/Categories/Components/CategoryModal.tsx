interface props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  form: {
    name: string
    description: string
    color: string
  }
  setForm: React.Dispatch<React.SetStateAction<{
    name: string
    description: string
    color: string
  }>>
  onSubmit: () => void
}

export const CategoryModal: React.FC<props> = ({ setShowModal, form, setForm, onSubmit }) => {
  
  return (
    <div className="fixed inset-0 bg-zinc-950/40 flex items-center justify-center">

    <div className="bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 border dark:border-zinc-600 rounded-xl shadow-lg w-100 p-6">

      <h2 className="text-xl font-bold mb-4">
        Nueva categoría
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full border rounded-lg p-2"
        />

        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border rounded-lg p-2"
        />

        <div className="flex items-center gap-3">

          <input
            type="color"
            value={form.color}
            onChange={(e) =>
              setForm({ ...form, color: e.target.value })
            }
          />

          <span className="text-sm text-zinc-900 dark:text-zinc-200">
            Color de la categoría
          </span>

        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-700/50"
        >
          Cancelar
        </button>

        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Crear
        </button>

      </div>

    </div>
  </div>
  )
}