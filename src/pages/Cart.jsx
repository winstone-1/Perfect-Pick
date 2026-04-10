import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart()
  const navigate = useNavigate()

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleQuantity = async (itemId, newQty) => {
    if (newQty < 1) return
    try {
      await updateQuantity(itemId, newQty)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity')
    }
  }

  if (!cart.items || cart.items.length === 0) return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-[#c49a70] mb-4" />
        <h2 className="font-serif text-2xl text-[#3d271a] mb-2">Your cart is empty</h2>
        <p className="text-[#9a6340] mb-6">Add some products to get started.</p>
        <Link to="/products">
          <Button className="bg-[#c08050] hover:bg-[#9a6340] text-white">
            Browse Products
          </Button>
        </Link>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-[#3d271a] mb-8">Your Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div key={item._id} className="flex gap-4 bg-white border border-[#e8c49a]/40 rounded-xl p-4">
                <div className="w-20 h-20 bg-[#f9eede] rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#3d271a] text-sm">{item.product?.name}</h3>
                  <p className="text-xs text-[#9a6340] mb-1">Variant: {item.variant}</p>
                  <p className="text-[#c08050] font-semibold text-sm">
                    KSh {item.product?.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleQuantity(item._id, item.quantity - 1)}
                      className="w-6 h-6 rounded border border-[#e8c49a] flex items-center justify-center text-[#7a4d32] hover:bg-[#f9eede]"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm text-[#3d271a] w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity(item._id, item.quantity + 1)}
                      className="w-6 h-6 rounded border border-[#e8c49a] flex items-center justify-center text-[#7a4d32] hover:bg-[#f9eede]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-[#c49a70] hover:text-red-400 transition-colors self-start"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-[#e8c49a]/40 rounded-xl p-6 h-fit">
            <h2 className="font-serif text-xl text-[#3d271a] mb-4">Order Summary</h2>
            <Separator className="bg-[#e8c49a]/40 mb-4" />
            <div className="flex justify-between text-sm text-[#5c3a26] mb-2">
              <span>Subtotal</span>
              <span>KSh {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-[#5c3a26] mb-4">
              <span>Delivery</span>
              <span className="text-[#9a6340]">Calculated at checkout</span>
            </div>
            <Separator className="bg-[#e8c49a]/40 mb-4" />
            <div className="flex justify-between font-semibold text-[#3d271a] mb-6">
              <span>Total</span>
              <span>KSh {cartTotal.toLocaleString()}</span>
            </div>
            <Button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#c08050] hover:bg-[#9a6340] text-white"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Cart