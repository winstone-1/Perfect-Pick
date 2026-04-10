import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [related, setRelated] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data } = await API.get(`/products/${id}`)
        setProduct(data)
        setSelectedVariant(data.variants[0])

        const { data: relatedData } = await API.get(`/products?category=${data.category}`)
        setRelated(relatedData.filter(p => p._id !== id).slice(0, 4))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) return navigate('/login')
    if (!selectedVariant) return toast.error('Please select a variant')
    try {
      setAdding(true)
      await addToCart(product._id, selectedVariant.name, quantity)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-xl bg-[#f3dcc0]" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 bg-[#f3dcc0]" />
          <Skeleton className="h-6 w-1/4 bg-[#f3dcc0]" />
          <Skeleton className="h-24 bg-[#f3dcc0]" />
        </div>
      </div>
    </Layout>
  )

  if (!product) return (
    <Layout>
      <div className="text-center py-20 text-[#9a6340]">Product not found.</div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-square bg-[#f9eede] rounded-xl overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
            )}
          </div>

          {/* Details */}
          <div>
            <Badge className="mb-3 bg-[#f3dcc0] text-[#7a4d32] capitalize">{product.category}</Badge>
            <h1 className="font-serif text-3xl text-[#3d271a] mb-2">{product.name}</h1>
            <p className="text-2xl text-[#c08050] font-semibold mb-4">KSh {product.price.toLocaleString()}</p>
            <p className="text-[#5c3a26] text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Variants */}
            <div className="mb-6">
              <p className="text-sm font-medium text-[#3d271a] mb-2">Select Variant:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                      selectedVariant?._id === variant._id
                        ? 'bg-[#c08050] text-white border-[#c08050]'
                        : variant.stock === 0
                        ? 'border-[#e8c49a] text-[#c49a70] opacity-50 cursor-not-allowed'
                        : 'border-[#e8c49a] text-[#5c3a26] hover:border-[#c08050]'
                    }`}
                  >
                    {variant.name}
                    {variant.stock === 0 && ' (Out of stock)'}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <p className="text-xs text-[#9a6340] mt-2">{selectedVariant.stock} in stock</p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <p className="text-sm font-medium text-[#3d271a]">Quantity:</p>
              <div className="flex items-center border border-[#e8c49a] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-[#7a4d32] hover:bg-[#f9eede]"
                >−</button>
                <span className="px-4 py-2 text-sm text-[#3d271a]">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(selectedVariant?.stock || 1, q + 1))}
                  className="px-3 py-2 text-[#7a4d32] hover:bg-[#f9eede]"
                >+</button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={adding || !selectedVariant || selectedVariant.stock === 0}
              className="w-full bg-[#c08050] hover:bg-[#9a6340] text-white py-5"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl text-[#3d271a] mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

import ProductCard from '../components/ProductCard'
export default ProductDetail