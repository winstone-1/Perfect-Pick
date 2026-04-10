import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import API from '../api/axios'

const categories = [
  { label: 'Bags', value: 'bags', emoji: '👜' },
  { label: 'Shoes', value: 'shoes', emoji: '👠' },
  { label: 'Jewelry', value: 'jewelry', emoji: '💍' },
  { label: 'Gifts', value: 'gifts', emoji: '🎁' },
]

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products?sort=price_desc')
        setFeatured(data.slice(0, 4))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#f9eede] py-20 px-4 text-center">
        <p className="text-[#c08050] text-sm tracking-widest uppercase mb-3">Welcome to</p>
        <h1 className="font-serif text-5xl md:text-6xl text-[#3d271a] mb-4">Perfect Pick</h1>
        <p className="text-[#7a4d32] text-lg max-w-md mx-auto mb-8">
          Curated bags, shoes, jewelry and gifts for every occasion.
        </p>
        <Link to="/products">
          <Button className="bg-[#c08050] hover:bg-[#9a6340] text-white px-8 py-5 text-base">
            Shop Now
          </Button>
        </Link>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="font-serif text-3xl text-[#3d271a] text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="bg-[#fdf8f3] border border-[#e8c49a]/40 rounded-xl p-6 text-center hover:bg-[#f9eede] hover:shadow-sm transition-all"
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <p className="text-[#7a4d32] font-medium">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-serif text-3xl text-[#3d271a] text-center mb-8">Featured Products</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl bg-[#f3dcc0]" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-center text-[#9a6340]">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/products">
            <Button variant="outline" className="border-[#c08050] text-[#c08050] hover:bg-[#f9eede]">
              View All Products
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export default Home