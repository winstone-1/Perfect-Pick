import { useState } from 'react'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { User, Package, Heart, Lock } from 'lucide-react'
import API from '../api/axios'

const Profile = () => {
  const { user, login } = useAuth()
  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [nameLoading, setNameLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({})

  const handleNameUpdate = async () => {
    if (!nameForm.name.trim()) return toast.error('Name cannot be empty')
    try {
      setNameLoading(true)
      const { data } = await API.put('/auth/profile', { name: nameForm.name })
      login({ ...user, name: data.data.name })
      toast.success('Name updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update name')
    } finally {
      setNameLoading(false)
    }
  }

  const validatePassword = () => {
    const errors = {}
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required'
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required'
    if (passwordForm.newPassword.length < 6) errors.newPassword = 'Must be at least 6 characters'
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match'
    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePasswordUpdate = async () => {
    if (!validatePassword()) return
    try {
      setPasswordLoading(true)
      await API.put('/auth/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-[#3d271a] mb-8">My Account</h1>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="space-y-2">
            <div className="bg-white border border-[#e8c49a]/40 rounded-xl p-6 text-center mb-4">
              <div className="w-16 h-16 bg-[#f9eede] rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={28} className="text-[#c08050]" />
              </div>
              <p className="font-medium text-[#3d271a]">{user?.name}</p>
              <p className="text-xs text-[#9a6340] mt-1">{user?.email}</p>
              {user?.isAdmin && (
                <span className="inline-block mt-2 text-xs bg-[#f3dcc0] text-[#7a4d32] px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
              {user?.role === 'manager' && (
                <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  Manager
                </span>
              )}
            </div>

            {[
              { icon: <Package size={16} />, label: 'My Orders', path: '/orders' },
              { icon: <Heart size={16} />, label: 'My Wishlist', path: '/wishlist' },
            ].map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#5c3a26] hover:bg-[#f9eede] border border-[#e8c49a]/40 bg-white transition-colors"
              >
                <span className="text-[#c08050]">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">

            {/* Update Name */}
            <div className="bg-white border border-[#e8c49a]/40 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-[#c08050]" />
                <h2 className="font-medium text-[#3d271a]">Personal Info</h2>
              </div>
              <Separator className="bg-[#e8c49a]/40 mb-4" />
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#5c3a26] mb-1 block">Full Name</label>
                  <Input
                    value={nameForm.name}
                    onChange={e => setNameForm({ name: e.target.value })}
                    className="border-[#e8c49a]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#5c3a26] mb-1 block">Email</label>
                  <Input
                    value={user?.email}
                    disabled
                    className="border-[#e8c49a] bg-[#fdf8f3] text-[#9a6340]"
                  />
                  <p className="text-xs text-[#9a6340] mt-1">Email cannot be changed</p>
                </div>
                <Button
                  onClick={handleNameUpdate}
                  disabled={nameLoading}
                  className="bg-[#c08050] hover:bg-[#9a6340] text-white"
                >
                  {nameLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

            {/* Update Password */}
            <div className="bg-white border border-[#e8c49a]/40 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={18} className="text-[#c08050]" />
                <h2 className="font-medium text-[#3d271a]">Change Password</h2>
              </div>
              <Separator className="bg-[#e8c49a]/40 mb-4" />
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#5c3a26] mb-1 block">Current Password</label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="border-[#e8c49a]"
                    placeholder="••••••••"
                  />
                  {passwordErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.currentPassword}</p>}
                </div>
                <div>
                  <label className="text-sm text-[#5c3a26] mb-1 block">New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="border-[#e8c49a]"
                    placeholder="••••••••"
                  />
                  {passwordErrors.newPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.newPassword}</p>}
                </div>
                <div>
                  <label className="text-sm text-[#5c3a26] mb-1 block">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="border-[#e8c49a]"
                    placeholder="••••••••"
                  />
                  {passwordErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.confirmPassword}</p>}
                </div>
                <Button
                  onClick={handlePasswordUpdate}
                  disabled={passwordLoading}
                  className="bg-[#c08050] hover:bg-[#9a6340] text-white"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile