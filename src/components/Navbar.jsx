import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#fdf8f3] border-b border-[#e8c49a]/40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl text-[#7a4d32] tracking-wide">
          Perfect Pick
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-[#5c3a26] hover:text-[#c08050] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {(user.isAdmin || user.role === 'manager') && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-[#e8c49a] text-[#7a4d32] hover:bg-[#f9eede]">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-[#7a4d32] hover:bg-[#f9eede]">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#c08050] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-[#7a4d32] hover:bg-[#f9eede]"
              >
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-[#7a4d32] hover:bg-[#f9eede]">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-[#c08050] hover:bg-[#9a6340] text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#7a4d32]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#fdf8f3] px-4 pb-4 flex flex-col gap-3">
          <Separator className="bg-[#e8c49a]/40" />
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#5c3a26] hover:text-[#c08050] py-1"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              {(user.isAdmin || user.role === 'manager') && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-[#5c3a26]">
                  Dashboard
                </Link>
              )}
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm text-[#5c3a26] flex items-center gap-2">
                <ShoppingBag size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <button onClick={handleLogout} className="text-sm text-left text-[#5c3a26] flex items-center gap-2">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-[#5c3a26]">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-[#5c3a26]">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar