import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useCart } from '../context/CartContext'
import API from '../api/axios'

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
  })
  const [errors, setErrors] = useState({})
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [mpesaStep, setMpesaStep] = useState('idle')
  const [checkoutRequestId, setCheckoutRequestId] = useState(null)
  const [mpesaError, setMpesaError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleMpesaPayment = async () => {
    if (!validate()) return
    if (!mpesaPhone.trim()) return setMpesaError('Please enter your M-Pesa phone number')

    try {
      setLoading(true)
      const orderRes = await API.post('/orders', { shippingAddress: form })
      const orderId = orderRes.data._id

      const mpesaRes = await API.post('/mpesa/stkpush', {
        phone: mpesaPhone,
        amount: cartTotal,
        orderId,
      })

      setCheckoutRequestId(mpesaRes.data.checkoutRequestId)
      setMpesaStep('waiting')
      await clearCart()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  const handleQueryPayment = async () => {
    try {
      setLoading(true)
      const { data } = await API.post('/mpesa/query', { checkoutRequestId })
      if (data.resultCode === '0' || data.resultCode === 0) {
        setMpesaStep('success')
        setTimeout(() => {
          toast.success('Order placed successfully!')
          navigate('/orders')
        }, 1500)
      } else {
        setMpesaStep('failed')
        toast.error('Payment not confirmed. Please try again.')
      }
    } catch (error) {
      toast.error('Could not verify payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-[#3d271a] mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="md:col-span-2 bg-white border border-[#e8c49a]/40 rounded-xl p-6">
            <h2 className="font-medium text-[#3d271a] mb-4">Shipping Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#5c3a26] mb-1 block">Full Name</label>
                <Input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="border-[#e8c49a]"
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-sm text-[#5c3a26] mb-1 block">Phone Number</label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0712 345 678"
                  className="border-[#e8c49a]"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-sm text-[#5c3a26] mb-1 block">Address</label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Moi Avenue"
                  className="border-[#e8c49a]"
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="text-sm text-[#5c3a26] mb-1 block">City</label>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Nairobi"
                  className="border-[#e8c49a]"
                />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-[#e8c49a]/40 rounded-xl p-6 h-fit">
            <h2 className="font-serif text-xl text-[#3d271a] mb-4">Order Summary</h2>
            <Separator className="bg-[#e8c49a]/40 mb-4" />
            <div className="space-y-2 mb-4">
              {cart.items?.map(item => (
                <div key={item._id} className="flex justify-between text-xs text-[#5c3a26]">
                  <span className="line-clamp-1 flex-1">{item.product?.name} x{item.quantity}</span>
                  <span className="ml-2">KSh {(item.product?.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Separator className="bg-[#e8c49a]/40 mb-4" />
            <div className="flex justify-between font-semibold text-[#3d271a] mb-6">
              <span>Total</span>
              <span>KSh {cartTotal.toLocaleString()}</span>
            </div>

            {/* M-Pesa Payment */}
            {mpesaStep === 'idle' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#5c3a26] mb-1 block">M-Pesa Phone Number</label>
                  <Input
                    value={mpesaPhone}
                    onChange={e => {
                      setMpesaPhone(e.target.value)
                      setMpesaError('')
                    }}
                    placeholder="07XX XXX XXX"
                    className="border-[#e8c49a]"
                  />
                  {mpesaError && <p className="text-red-400 text-xs mt-1">{mpesaError}</p>}
                </div>
                <Button
                  onClick={handleMpesaPayment}
                  disabled={loading}
                  className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white py-5"
                >
                  {loading ? 'Processing...' : '💚 Pay with M-Pesa'}
                </Button>
              </div>
            )}

            {mpesaStep === 'waiting' && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium text-[#3d271a]">Check your phone!</p>
                <p className="text-xs text-[#9a6340]">Enter your M-Pesa PIN to complete payment</p>
                <Button
                  onClick={handleQueryPayment}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="border-[#4CAF50] text-[#4CAF50] hover:bg-green-50"
                >
                  {loading ? 'Checking...' : "I've paid — confirm"}
                </Button>
                <button
                  onClick={() => setMpesaStep('idle')}
                  className="block text-xs text-[#9a6340] hover:underline mx-auto"
                >
                  Cancel
                </button>
              </div>
            )}

            {mpesaStep === 'success' && (
              <div className="text-center py-4 space-y-2">
                <div className="text-4xl">✅</div>
                <p className="font-medium text-green-600">Payment confirmed!</p>
                <p className="text-xs text-[#9a6340]">Redirecting to your orders...</p>
              </div>
            )}

            {mpesaStep === 'failed' && (
              <div className="text-center py-4 space-y-3">
                <div className="text-4xl">❌</div>
                <p className="font-medium text-red-500">Payment failed</p>
                <p className="text-xs text-[#9a6340]">Please try again</p>
                <Button
                  onClick={() => setMpesaStep('idle')}
                  className="bg-[#c08050] hover:bg-[#9a6340] text-white"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Checkout