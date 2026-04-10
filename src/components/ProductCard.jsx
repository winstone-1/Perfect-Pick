import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist()
  const { user } = useAuth()
  const navigate = useNavigate()
  const wishlisted = isWishlisted(product._id)

  const handleWishlist = (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    wishlisted ? removeFromWishlist(product._id) : addToWishlist(product)
  }

  return (
    <Link to={`/products/${product._id}`}>
      <Card className="group hover:shadow-md transition-shadow duration-300 border-[#e8c49a]/40 bg-white overflow-hidden">
        <div className="aspect-square overflow-hidden bg-[#f9eede] relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#c49a70] text-4xl">
              🛍️
            </div>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              size={14}
              className={wishlisted ? 'text-red-400 fill-red-400' : 'text-[#c49a70]'}
            />
          </button>
        </div>
        <CardContent className="p-4">
          <Badge className="mb-2 bg-[#f3dcc0] text-[#7a4d32] hover:bg-[#e8c49a] capitalize text-xs">
            {product.category}
          </Badge>
          <h3 className="font-medium text-[#3d271a] text-sm line-clamp-1">{product.name}</h3>
          <p className="text-[#c08050] font-semibold mt-1">KSh {product.price.toLocaleString()}</p>
          <p className="text-xs text-[#9a6340] mt-1">
            {product.variants?.length} variant{product.variants?.length !== 1 ? 's' : ''} available
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProductCard