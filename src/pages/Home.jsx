import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Truck, Shield, Star, RefreshCw } from 'lucide-react'
import API from '../api/axios'

const categories = [
  { label: 'Bags', value: 'bags', emoji: '👜', desc: 'Handbags, totes & clutches' },
  { label: 'Shoes', value: 'shoes', emoji: '👠', desc: 'Heels, flats & sandals' },
  { label: 'Jewelry', value: 'jewelry', emoji: '💍', desc: 'Necklaces, rings & more' },
  { label: 'Gifts', value: 'gifts', emoji: '🎁', desc: 'For every occasion' },
]

const features = [
  { icon: <Star size={20} />, label: 'Curated Quality', desc: 'Every item is handpicked for quality and style.' },
  { icon: <Truck size={20} />, label: 'Fast Delivery', desc: 'Quick and reliable delivery across Nairobi.' },
  { icon: <Shield size={20} />, label: 'Secure Shopping', desc: 'Your orders and data are always safe with us.' },
  { icon: <RefreshCw size={20} />, label: 'Easy Returns', desc: 'Hassle-free returns within 7 days of purchase.' },
]

const testimonials = [
  { name: 'Amina K.', text: 'Perfect Pick never disappoints. The bags are gorgeous and the service is amazing!', stars: 5 },
  { name: 'Cynthia M.', text: 'I got the most beautiful jewelry set for my sister\'s birthday. She absolutely loved it!', stars: 5 },
  { name: 'Fatuma A.', text: 'Great quality shoes at fair prices. Will definitely be shopping here again.', stars: 5 },
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
      <section className="relative bg-[#f9eede] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#c08050] text-sm tracking-widest uppercase mb-3">
              Nairobi's Favourite Boutique
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-[#3d271a] leading-tight mb-5">
              Find Your <br />
              <span className="text-[#c08050]">Perfect Pick</span>
            </h1>
            <p className="text-[#7a4d32] text-lg max-w-md mb-8 leading-relaxed">
              Curated bags, shoes, jewelry and gifts for women who appreciate quality and style.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Link to="/products">
                <Button className="bg-[#c08050] hover:bg-[#9a6340] text-white px-8 py-5 text-base">
                  Shop Now
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-[#c08050] text-[#c08050] hover:bg-[#f9eede] px-8 py-5 text-base">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm">
            {['👜', '👠', '💍', '🎁'].map((emoji, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 flex items-center justify-center text-5xl shadow-sm ${i === 1 ? 'mt-6' : ''} ${i === 3 ? '-mt-6' : ''}`}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#e8c49a]/20 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#c08050]/10 rounded-full" />
      </section>

      {/* Stats Bar */}
      <section className="bg-[#3d271a] py-6">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '500+', label: 'Products' },
            { value: '1,000+', label: 'Happy Customers' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="font-serif text-2xl text-[#e8c49a]">{stat.value}</p>
              <p className="text-xs text-[#c49a70] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-[#c08050] text-sm tracking-widest uppercase mb-2">Browse</p>
          <h2 className="font-serif text-4xl text-[#3d271a]">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="group bg-[#fdf8f3] border border-[#e8c49a]/40 rounded-2xl p-6 text-center hover:bg-[#f9eede] hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-5xl mb-3">{cat.emoji}</div>
              <p className="text-[#3d271a] font-medium mb-1">{cat.label}</p>
              <p className="text-xs text-[#9a6340]">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#fdf8f3] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#c08050] text-sm tracking-widest uppercase mb-2">Handpicked</p>
            <h2 className="font-serif text-4xl text-[#3d271a]">Featured Products</h2>
          </div>
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
          <div className="text-center mt-10">
            <Link to="/products">
              <Button variant="outline" className="border-[#c08050] text-[#c08050] hover:bg-[#f9eede] px-8">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-[#c08050] text-sm tracking-widest uppercase mb-2">Why Us</p>
          <h2 className="font-serif text-4xl text-[#3d271a]">The Perfect Pick Promise</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.label} className="text-center">
              <div className="w-12 h-12 bg-[#f9eede] rounded-full flex items-center justify-center text-[#c08050] mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="font-medium text-[#3d271a] mb-2 text-sm">{f.label}</h3>
              <p className="text-xs text-[#9a6340] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f9eede] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#c08050] text-sm tracking-widest uppercase mb-2">Reviews</p>
            <h2 className="font-serif text-4xl text-[#3d271a]">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-[#e8c49a]/40">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#c08050] fill-[#c08050]" />
                  ))}
                </div>
                <p className="text-[#5c3a26] text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-medium text-[#3d271a] text-sm">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#3d271a] py-16 px-4 text-center">
        <p className="text-[#c49a70] text-sm tracking-widest uppercase mb-3">Ready to shop?</p>
        <h2 className="font-serif text-4xl text-[#e8c49a] mb-4">Find Your Perfect Pick Today</h2>
        <p className="text-[#c49a70] max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Browse our full collection of bags, shoes, jewelry and gifts. Something special is waiting for you.
        </p>
        <Link to="/products">
          <Button className="bg-[#c08050] hover:bg-[#9a6340] text-white px-10 py-5 text-base">
            Shop the Collection
          </Button>
        </Link>
      </section>

    </Layout>
  )
}

export default Home