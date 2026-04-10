import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import API from '../../api/axios'

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const ManageOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/admin/orders')
        setOrders(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { status })
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o))
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-[#3d271a] mb-8">Manage Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-[#f3dcc0]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-[#9a6340] py-20">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white border border-[#e8c49a]/40 rounded-xl p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#9a6340]">Order ID</p>
                    <p className="text-sm font-mono text-[#3d271a]">{order._id}</p>
                    <p className="text-xs text-[#9a6340] mt-1">
                      {order.user?.name} — {order.user?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-[#c08050]">KSh {order.totalPrice.toLocaleString()}</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border-0 font-medium capitalize cursor-pointer ${statusColors[order.status]}`}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
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

export default ManageOrders