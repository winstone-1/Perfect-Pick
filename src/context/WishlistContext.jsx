import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem(`wishlist_${user._id}`)) || []
      setWishlist(saved)
    } else {
      setWishlist([])
    }
  }, [user])

  const save = (items) => {
    setWishlist(items)
    if (user) {
      localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(items))
    }
  }

  const addToWishlist = (product) => {
    if (wishlist.find(p => p._id === product._id)) return
    save([...wishlist, product])
  }

  const removeFromWishlist = (productId) => {
    save(wishlist.filter(p => p._id !== productId))
  }

  const isWishlisted = (productId) => wishlist.some(p => p._id === productId)

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)