import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bell, Lock, Edit, Save, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProfileNav from '../../components/navigation/ProfileNav';
import { useAuth } from '../../components/auth/AuthContext';
// import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || user?.email || 'Guest User',
    email: user?.email || 'guest@example.com',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would update the user profile here
    // Track profile update (commented out for production)
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <DashboardLayout
      title="Profile"
      subtitle="Manage your account settings and preferences"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Profile', path: '/dashboard/profile' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Section>
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileNav />
          
          <div className="flex-1">
            {!user && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Guest Mode
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You're using SocialCaution in guest mode. Sign in to save your profile and access enhanced features.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {isEditing ? (
                    <>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number (optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex space-x-4 pt-4">
                        <Button type="submit" variant="primary">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">{user?.name || user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Subscription</p>
                          <p className="font-medium capitalize">{user?.subscriptionTier || 'Free'}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-6">Security</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Login Notifications
                </Button>
              </div>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">{user?.name || user?.email}</h3>
                <p className="text-gray-600 text-sm mb-6">Member since {new Date().toLocaleDateString()}</p>
                <Button variant="outline" className="w-full mb-4">
                  Upload Photo
                </Button>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Update Email Preferences
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-500 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
          </div>
        </div>
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProfilePage;