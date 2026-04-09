import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    if (!user) return setCart({ items: [] })
    try {
      setLoading(true)
      const { data } = await API.get('/cart')
      setCart(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, variant, quantity) => {
    try {
      const { data } = await API.post('/cart', { productId, variant, quantity })
      setCart(data)
    } catch (error) {
      throw error
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await API.delete(`/cart/${itemId}`)
      setCart(data)
    } catch (error) {
      throw error
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await API.put(`/cart/${itemId}`, { quantity })
      setCart(data.data)
    } catch (error) {
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await API.delete('/cart')
      setCart({ items: [] })
    } catch (error) {
      throw error
    }
  }

  const cartCount = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const cartTotal = cart.items?.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0) || 0

  useEffect(() => {
    fetchCart()
  }, [user])

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartCount,
      cartTotal,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)