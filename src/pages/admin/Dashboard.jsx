import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingBag, Package, Users, TrendingUp } from 'lucide-react'
import API from '../../api/axios'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          API.get('/admin/orders'),
          API.get('/admin/users'),
        ])
        const orders = ordersRes.data
        const users = usersRes.data
        const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0)
        const pending = orders.filter(o => o.status === 'pending').length
        setStats({ orders: orders.length, users: users.length, revenue, pending })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Orders', value: stats?.orders, icon: <Package size={20} />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Users', value: stats?.users, icon: <Users size={20} />, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Revenue', value: `KSh ${stats?.revenue?.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'text-green-600 bg-green-50' },
    { label: 'Pending Orders', value: stats?.pending, icon: <ShoppingBag size={20} />, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-[#3d271a] mb-2">Admin Dashboard</h1>
        <p className="text-[#9a6340] mb-8">Welcome back. Here's what's happening.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {cards.map(card => (
            <Card key={card.label} className="border-[#e8c49a]/40">
              <CardContent className="p-5">
                {loading ? (
                  <Skeleton className="h-16 bg-[#f3dcc0]" />
                ) : (
                  <>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                      {card.icon}
                    </div>
                    <p className="text-2xl font-semibold text-[#3d271a]">{card.value}</p>
                    <p className="text-xs text-[#9a6340] mt-1">{card.label}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/admin/products">
            <div className="bg-[#f9eede] border border-[#e8c49a]/40 rounded-xl p-6 hover:shadow-sm transition-shadow">
              <ShoppingBag size={24} className="text-[#c08050] mb-3" />
              <h3 className="font-medium text-[#3d271a] mb-1">Manage Products</h3>
              <p className="text-sm text-[#9a6340]">Add, edit, or remove products from the store.</p>
            </div>
          </Link>
          <Link to="/admin/orders">
            <div className="bg-[#f9eede] border border-[#e8c49a]/40 rounded-xl p-6 hover:shadow-sm transition-shadow">
              <Package size={24} className="text-[#c08050] mb-3" />
              <h3 className="font-medium text-[#3d271a] mb-1">Manage Orders</h3>
              <p className="text-sm text-[#9a6340]">View and update order statuses.</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard