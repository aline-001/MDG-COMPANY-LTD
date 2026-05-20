'use client';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import api from '../../lib/api';

export default function AccountSettingsPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch user profile details
    const fetchUserDetails = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data) {
          setFormData({
            firstName: res.data.firstName || '',
            lastName: res.data.lastName || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            city: res.data.city || '',
            zipCode: res.data.zipCode || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put('/users/profile', formData);
      if (res.data) {
        setUser(res.data);
        showNotification({
          title: 'Success',
          message: 'Profile updated successfully',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification({
        title: 'Error',
        message: 'Passwords do not match',
        type: 'error',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showNotification({
        title: 'Error',
        message: 'Password must be at least 8 characters',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      showNotification({
        title: 'Success',
        message: 'Password changed successfully',
        type: 'success',
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to change password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-mdg-navy mb-2">Account Settings</h1>
          <p className="text-mdg-slate">Manage your profile and security settings</p>
        </div>

        {/* Profile Information Section */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-6">
          <h2 className="text-xl font-black text-mdg-navy mb-6">Profile Information</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-mdg-navy uppercase mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-mdg-navy uppercase mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-mdg-navy uppercase mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
              />
              <p className="text-xs text-mdg-slate mt-2">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-black text-mdg-navy uppercase mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-mdg-navy uppercase mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-mdg-navy uppercase mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-mdg-navy uppercase mb-2">Zip Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mdg-navy text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-mdg-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
          <h2 className="text-xl font-black text-mdg-navy mb-6">Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-mdg-navy uppercase mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-mdg-navy uppercase mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
              />
              <p className="text-xs text-mdg-slate mt-2">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-black text-mdg-navy uppercase mb-2">Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mdg-blue outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mdg-blue text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-mdg-navy transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
