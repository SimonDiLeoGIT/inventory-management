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
      <div className="bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-600 rounded-xl w-125 p-6">
        <h2 className="text-xl font-bold mb-4">Producto</h2>

        <div className="space-y-4">

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium mb-1">
              SKU
            </label>
            <input
              id="sku"
              value={form.sku}
              onChange={(e)=>setForm({...form,sku:e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e)=>setForm({...form,description:e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Categoría
            </label>
            <select
              id="category"
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
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label htmlFor="salePrice" className="block text-sm font-medium mb-1">
                Precio venta
              </label>
              <input
                id="salePrice"
                type="number"
                value={form.salePrice}
                onChange={(e)=>setForm({...form,salePrice:Number(e.target.value)})}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium mb-1">
                Costo
              </label>
              <input
                id="cost"
                type="number"
                value={form.cost}
                onChange={(e)=>setForm({...form,cost:Number(e.target.value)})}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                value={form.stock}
                onChange={(e)=>setForm({...form,stock:Number(e.target.value)})}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="minStock" className="block text-sm font-medium mb-1">
                Stock mínimo
              </label>
              <input
                id="minStock"
                type="number"
                value={form.minStock}
                onChange={(e)=>setForm({...form,minStock:Number(e.target.value)})}
                className="border p-2 rounded w-full"
              />
            </div>

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