import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import API from '../api/axios'

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders')
        setOrders(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-[#3d271a] mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-[#f3dcc0]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-[#c49a70] mb-4" />
            <h2 className="font-serif text-2xl text-[#3d271a] mb-2">No orders yet</h2>
            <p className="text-[#9a6340] mb-6">Start shopping to see your orders here.</p>
            <Link to="/products">
              <Button className="bg-[#c08050] hover:bg-[#9a6340] text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white border border-[#e8c49a]/40 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-[#9a6340] mb-1">Order ID</p>
                    <p className="text-sm font-mono text-[#3d271a]">{order._id}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-[#5c3a26]">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  <p className="font-semibold text-[#c08050]">KSh {order.totalPrice.toLocaleString()}</p>
                </div>
                <p className="text-xs text-[#9a6340] mt-2">
                  {new Date(order.createdAt).toLocaleDateString('en-KE', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Orders