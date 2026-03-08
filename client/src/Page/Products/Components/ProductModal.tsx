interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  form: any
  setForm: any
  categories: { id:number; name:string }[]
  onSubmit: () => void
}

export const ProductModal: React.FC<Props> = ({
  setShowModal,
  form,
  setForm,
  categories,
  onSubmit
}) => {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl w-125 p-6">
        <h2 className="text-xl font-bold mb-4"> Producto </h2>
        <div className="space-y-4">
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="SKU"
            value={form.sku}
            onChange={(e)=>setForm({...form,sku:e.target.value})}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e)=>setForm({...form,description:e.target.value})}
            className="w-full border p-2 rounded"
          />
          <select
            value={form.categoryId}
            onChange={(e)=>setForm({...form,categoryId:Number(e.target.value)})}
            className="w-full border p-2 rounded"
          >
            <option value={0}>Seleccionar categoría</option>
            {categories.map(cat=>(
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Precio venta"
              value={form.salePrice}
              onChange={(e)=>setForm({...form,salePrice:Number(e.target.value)})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Costo"
              value={form.cost}
              onChange={(e)=>setForm({...form,cost:Number(e.target.value)})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e)=>setForm({...form,stock:Number(e.target.value)})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Stock mínimo"
              value={form.minStock}
              onChange={(e)=>setForm({...form,minStock:Number(e.target.value)})}
              className="border p-2 rounded"
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
            onClick={onSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}