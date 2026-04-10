import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Toaster } from './components/ui/sonner'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Dashboard from './pages/admin/Dashboard'
import ManageProducts from './pages/admin/ManageProducts'
import ManageOrders from './pages/admin/ManageOrders'
import Orders from './pages/Orders'
import { WishlistProvider } from './context/WishlistContext'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import OrderDetail from './pages/OrderDetail'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
        <CartProvider>

          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          </Routes>
        </CartProvider>
          </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App