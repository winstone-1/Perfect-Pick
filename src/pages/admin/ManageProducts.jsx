import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus } from 'lucide-react'
import API from '../../api/axios'

const emptyForm = {
  name: '', description: '', price: '', category: 'bags', image: '',
  variants: [{ name: '', stock: '' }],
}

const ManageProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products')
      setProducts(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product._id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      image: product.image || '',
      variants: product.variants.map(v => ({ name: v.name, stock: v.stock })),
    })
    setDialogOpen(true)
  }

  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants]
    updated[index][field] = value
    setForm({ ...form, variants: updated })
  }

  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { name: '', stock: '' }] })
  }

  const removeVariant = (index) => {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) })
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return toast.error('Fill in all required fields')
    try {
      setSaving(true)
      const payload = {
        ...form,
        price: Number(form.price),
        variants: form.variants.map(v => ({ name: v.name, stock: Number(v.stock) })),
      }
      if (editing) {
        await API.put(`/admin/products/${editing}`, payload)
        toast.success('Product updated')
      } else {
        await API.post('/admin/products', payload)
        toast.success('Product created')
      }
      setDialogOpen(false)
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/products/${id}`)
      setProducts(products.filter(p => p._id !== id))
      toast.success('Product deleted')
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-[#3d271a]">Manage Products</h1>
          <Button onClick={openAdd} className="bg-[#c08050] hover:bg-[#9a6340] text-white">
            <Plus size={16} className="mr-2" /> Add Product
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl bg-[#f3dcc0]" />)}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-[#9a6340] py-20">No products yet. Add your first one!</p>
        ) : (
          <div className="space-y-3">
            {products.map(product => (
              <div key={product._id} className="flex items-center gap-4 bg-white border border-[#e8c49a]/40 rounded-xl p-4">
                <div className="w-12 h-12 bg-[#f9eede] rounded-lg overflow-hidden flex-shrink-0">
                  {product.image
                    ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                  }
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#3d271a] text-sm">{product.name}</p>
                  <p className="text-xs text-[#9a6340] capitalize">{product.category} · KSh {product.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => openEdit(product)} variant="ghost" size="icon" className="text-[#7a4d32] hover:bg-[#f9eede]">
                    <Pencil size={15} />
                  </Button>
                  <Button onClick={() => handleDelete(product._id)} variant="ghost" size="icon" className="text-red-400 hover:bg-red-50">
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#fdf8f3]">
          <DialogHeader>
            <DialogTitle className="font-serif text-[#3d271a]">
              {editing ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-[#5c3a26] mb-1 block">Name *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border-[#e8c49a]" />
            </div>
            <div>
              <label className="text-xs text-[#5c3a26] mb-1 block">Description</label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border-[#e8c49a]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#5c3a26] mb-1 block">Price (KSh) *</label>
                <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border-[#e8c49a]" />
              </div>
              <div>
                <label className="text-xs text-[#5c3a26] mb-1 block">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-[#e8c49a] rounded-md px-3 py-2 text-sm text-[#5c3a26] bg-white"
                >
                  {['bags', 'shoes', 'jewelry', 'gifts'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#5c3a26] mb-1 block">Image URL</label>
              <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="border-[#e8c49a]" placeholder="https://..." />
            </div>

            {/* Variants */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-[#5c3a26]">Variants</label>
                <button onClick={addVariant} className="text-xs text-[#c08050] hover:underline flex items-center gap-1">
                  <Plus size={12} /> Add variant
                </button>
              </div>
              <div className="space-y-2">
                {form.variants.map((v, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      placeholder="Name (e.g. Small)"
                      value={v.name}
                      onChange={e => handleVariantChange(i, 'name', e.target.value)}
                      className="border-[#e8c49a] text-sm"
                    />
                    <Input
                      placeholder="Stock"
                      type="number"
                      value={v.stock}
                      onChange={e => handleVariantChange(i, 'stock', e.target.value)}
                      className="border-[#e8c49a] text-sm w-24"
                    />
                    {form.variants.length > 1 && (
                      <button onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#c08050] hover:bg-[#9a6340] text-white"
            >
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export default ManageProducts