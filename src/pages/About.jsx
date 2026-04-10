import Layout from '../components/Layout'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#f9eede] py-16 px-4 text-center">
        <p className="text-[#c08050] text-sm tracking-widest uppercase mb-3">Our Story</p>
        <h1 className="font-serif text-5xl text-[#3d271a] mb-4">About Perfect Pick</h1>
        <p className="text-[#7a4d32] max-w-xl mx-auto leading-relaxed">
          A boutique born from a love of beautiful things and a desire to make every woman feel special.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-serif text-3xl text-[#3d271a] mb-4">Who We Are</h2>
            <p className="text-[#5c3a26] leading-relaxed mb-4">
              Perfect Pick is a family-owned retail boutique based in Nairobi, Kenya. We curate a carefully selected range of bags, shoes, jewelry, and gifts for women who appreciate quality and style.
            </p>
            <p className="text-[#5c3a26] leading-relaxed">
              Every item in our store is handpicked with love and attention to detail. Whether you're treating yourself or looking for the perfect gift, we have something for every occasion.
            </p>
          </div>
          <div className="bg-[#f9eede] rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="font-serif text-xl text-[#7a4d32]">"Curated with love,<br />for every occasion."</p>
          </div>
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto bg-[#e8c49a]/40" />

      {/* What We Offer */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="font-serif text-3xl text-[#3d271a] text-center mb-10">What We Offer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { emoji: '👜', label: 'Bags', desc: 'Handbags, totes, clutches & more' },
            { emoji: '👠', label: 'Shoes', desc: 'Heels, flats, sandals & sneakers' },
            { emoji: '💍', label: 'Jewelry', desc: 'Necklaces, earrings & bracelets' },
            { emoji: '🎁', label: 'Gifts', desc: 'Perfect for every occasion' },
          ].map(item => (
            <div key={item.label} className="bg-[#fdf8f3] border border-[#e8c49a]/40 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <h3 className="font-medium text-[#3d271a] mb-1">{item.label}</h3>
              <p className="text-xs text-[#9a6340]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto bg-[#e8c49a]/40" />

      {/* Contact */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="font-serif text-3xl text-[#3d271a] text-center mb-10">Find Us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: <MapPin size={20} />, label: 'Location', value: 'Nairobi, Kenya' },
            { icon: <Phone size={20} />, label: 'Phone', value: '+254 700 000 000' },
            { icon: <Mail size={20} />, label: 'Email', value: 'perfectpick@gmail.com' },
            { icon: <Clock size={20} />, label: 'Hours', value: 'Mon–Sat: 9am – 7pm' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-4 bg-white border border-[#e8c49a]/40 rounded-xl p-5">
              <div className="text-[#c08050] mt-0.5">{item.icon}</div>
              <div>
                <p className="text-xs text-[#9a6340] mb-0.5">{item.label}</p>
                <p className="text-[#3d271a] font-medium text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default About