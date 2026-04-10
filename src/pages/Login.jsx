import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.password.trim()) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      setLoading(true)
      const { data } = await API.post('/auth/login', form)
      login(data.data)
      toast.success(`Welcome back, ${data.data.name}!`)
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-[#e8c49a]/40 rounded-2xl p-8 shadow-sm">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#3d271a] mb-1">Welcome Back</h1>
            <p className="text-sm text-[#9a6340]">Sign in to your Perfect Pick account</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#5c3a26] mb-1 block">Email</label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="border-[#e8c49a] focus-visible:ring-[#c08050]"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm text-[#5c3a26] mb-1 block">Password</label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="border-[#e8c49a] focus-visible:ring-[#c08050]"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#c08050] hover:bg-[#9a6340] text-white py-5 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>

          <p className="text-center text-sm text-[#9a6340] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#c08050] hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Login