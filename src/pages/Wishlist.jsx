import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist()

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-[#3d271a] mb-8">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-[#c49a70] mb-4" />
            <h2 className="font-serif text-2xl text-[#3d271a] mb-2">Your wishlist is empty</h2>
            <p className="text-[#9a6340] mb-6">Save items you love and come back to them later.</p>
            <Link to="/products">
              <Button className="bg-[#c08050] hover:bg-[#9a6340] text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[#9a6340] mb-6">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wishlist.map(product => (
                <div key={product._id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Heart size={14} className="fill-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Wishlist