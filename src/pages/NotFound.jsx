import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        
        {/* Visual */}
        <div className="relative mb-8">
          <p className="font-serif text-[180px] leading-none text-[#f3dcc0] font-bold select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-6xl">🛍️</p>
          </div>
        </div>

        <h1 className="font-serif text-3xl text-[#3d271a] mb-3">
          Page Not Found
        </h1>
        <p className="text-[#9a6340] max-w-sm mb-8 leading-relaxed">
          Looks like this page took a shopping trip and never came back. Let's get you somewhere useful.
        </p>

        <div className="flex gap-3">
          <Link to="/">
            <Button className="bg-[#c08050] hover:bg-[#9a6340] text-white px-6">
              Go Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="border-[#c08050] text-[#c08050] hover:bg-[#f9eede] px-6">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default NotFound