import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Package, ArrowLeft } from 'lucide-react'
import API from '../api/axios'

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusSteps = ['pending', 'processing', 'shipped', 'delivered']

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`)
        setOrder(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48 bg-[#f3dcc0]" />
        <Skeleton className="h-32 rounded-xl bg-[#f3dcc0]" />
        <Skeleton className="h-48 rounded-xl bg-[#f3dcc0]" />
      </div>
    </Layout>
  )

  if (!order) return (
    <Layout>
      <div className="text-center py-20">
        <Package size={48} className="mx-auto text-[#c49a70] mb-4" />
        <p className="text-[#9a6340]">Order not found.</p>
        <Link to="/orders">
          <Button className="mt-4 bg-[#c08050] hover:bg-[#9a6340] text-white">
            Back to Orders
          </Button>
        </Link>
      </div>
    </Layout>
  )

  const currentStep = statusSteps.indexOf(order.status)

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Back */}
        <Link to="/orders" className="flex items-center gap-2 text-sm text-[#9a6340] hover:text-[#c08050] mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-serif text-3xl text-[#3d271a] mb-1">Order Details</h1>
            <p className="text-xs text-[#9a6340] font-mono">{order._id}</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* Order Progress */}
        {order.status !== 'cancelled' && (
          <div className="bg-white border border-[#e8c49a]/40 rounded-xl p-6 mb-6">
            <h2 className="font-medium text-[#3d271a] mb-4 text-sm">Order Progress</h2>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      i <= currentStep
                        ? 'bg-[#c08050] text-white'
                        : 'bg-[#f3dcc0] text-[#c49a70]'
                    }`}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <p className={`text-xs mt-1 capitalize ${i <= currentStep ? 'text-[#c08050]' : 'text-[#c49a70]'}`}>
                      {step}
                    </p>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < currentStep ? 'bg-[#c08050]' : 'bg-[#f3dcc0]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white border border-[#e8c49a]/40 rounded-xl p-6 mb-6">
          <h2 className="font-medium text-[#3d271a] mb-4 text-sm">Items Ordered</h2>
          <Separator className="bg-[#e8c49a]/40 mb-4" />
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item._id} className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-[#f9eede] rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#3d271a]">{item.product?.name}</p>
                  <p className="text-xs text-[#9a6340]">Variant: {item.variant} · Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-[#c08050]">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <Separator className="bg-[#e8c49a]/40 mt-4 mb-3" />
          <div className="flex justify-between font-semibold text-[#3d271a]">
            <span>Total</span>
            <span>KSh {order.totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white border border-[#e8c49a]/40 rounded-xl p-6 mb-6">
          <h2 className="font-medium text-[#3d271a] mb-4 text-sm">Shipping Address</h2>
          <Separator className="bg-[#e8c49a]/40 mb-4" />
          <div className="text-sm text-[#5c3a26] space-y-1">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-[#9a6340] text-center">
          Order placed on {new Date(order.createdAt).toLocaleDateString('en-KE', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>

      </div>
    </Layout>
  )
}

export default OrderDetail