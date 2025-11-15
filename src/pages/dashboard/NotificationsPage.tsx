import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useToastContext } from '../../hooks/useToastContext';


const NotificationsPage: React.FC = () => {
  const { success } = useToastContext();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Privacy Assessment Due',
      message: 'Your quarterly privacy assessment is due in 3 days.',
      date: '2024-03-20',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'New Login Detection',
      message: 'A new login was detected from an unfamiliar location.',
      date: '2024-03-19',
      read: true
    },
    {
      id: 3,
      type: 'info',
      title: 'Privacy Score Updated',
      message: 'Your privacy score has improved by 15 points!',
      date: '2024-03-18',
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      if (prev.some(n => !n.read)) {
        success('All notifications marked as read');
      }
      return updated;
    });
  };

  const loadMoreNotifications = () => {
    // In a real app, this would fetch more notifications from an API
    // For now, we'll just show a message or scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="View and manage your privacy notifications and alerts"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Notifications', path: '/dashboard/notifications' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.read)}
            >
              Mark all as read
            </Button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12" role="status" aria-live="polite">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No notifications</h4>
              <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-4" role="list" aria-label="Notifications list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? 'bg-gray-50' : 'bg-light-blue/10 border-accent'
                  }`}
                  role="listitem"
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {notification.type === 'alert' && (
                        <AlertTriangle className="h-5 w-5 text-danger" aria-hidden="true" />
                      )}
                      {notification.type === 'warning' && (
                        <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
                      )}
                      {notification.type === 'info' && (
                        <Info className="h-5 w-5 text-accent" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-primary">{notification.title}</h4>
                        {!notification.read && (
                          <Badge variant="accent" aria-label="New notification">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(notification.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <Button 
              variant="outline"
              onClick={loadMoreNotifications}
            >
              View All Notifications
            </Button>
          </div>
        </Card>
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default NotificationsPage;