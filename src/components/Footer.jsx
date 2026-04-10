import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Footer = () => {
  return (
    <footer className="bg-[#3d271a] text-[#f3dcc0] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="font-serif text-2xl text-[#e8c49a] mb-3">Perfect Pick</h3>
          <p className="text-sm text-[#c49a70] leading-relaxed">
            Your go-to boutique for bags, shoes, jewelry, and gifts. Curated with love for every occasion.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-medium text-[#e8c49a] mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-[#c49a70]">
            <Link to="/" className="hover:text-[#e8c49a] transition-colors">Home</Link>
            <Link to="/products" className="hover:text-[#e8c49a] transition-colors">Products</Link>
            <Link to="/about" className="hover:text-[#e8c49a] transition-colors">About Us</Link>
            <Link to="/cart" className="hover:text-[#e8c49a] transition-colors">Cart</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-medium text-[#e8c49a] mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-[#c49a70]">
            <span className="flex items-center gap-2">
              <MapPin size={14} /> Nairobi, Kenya
            </span>
            <span className="flex items-center gap-2">
              <Phone size={14} /> +254 700 000 000
            </span>
            <span className="flex items-center gap-2">
              <Mail size={14} /> perfectpick@gmail.com
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-[#5c3a26]" />
      <div className="text-center text-xs text-[#9a6340] py-4">
        © {new Date().getFullYear()} Perfect Pick. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer