import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'
import API from '../api/axios'

const categories = ['all', 'bags', 'shoes', 'jewelry', 'gifts']
const sortOptions = [
  { label: 'Newest', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')

  const category = searchParams.get('category') || 'all'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (category !== 'all') params.append('category', category)
        if (search) params.append('search', search)
        if (sort) params.append('sort', sort)
        const { data } = await API.get(`/products?${params}`)
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category, search, sort])

  const handleCategory = (cat) => {
    if (cat === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-[#3d271a] mb-8">Our Products</h1>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c49a70]" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-[#e8c49a] bg-white focus:ring-[#c08050]"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-[#e8c49a] rounded-md px-3 py-2 text-sm text-[#5c3a26] bg-white focus:outline-none"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <Button
              key={cat}
              onClick={() => handleCategory(cat)}
              variant={category === cat || (cat === 'all' && !searchParams.get('category')) ? 'default' : 'outline'}
              size="sm"
              className={
                category === cat || (cat === 'all' && !searchParams.get('category'))
                  ? 'bg-[#c08050] text-white hover:bg-[#9a6340]'
                  : 'border-[#e8c49a] text-[#7a4d32] hover:bg-[#f9eede]'
              }
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl bg-[#f3dcc0]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-[#9a6340]">
            <p className="text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Products