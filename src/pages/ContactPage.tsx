import React, { useState } from 'react';
import { MessageSquare, Send, User, AtSign, CheckCircle, AlertCircle, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form on success
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Contact Us"
      subtitle="Get in touch with our team"
      heroBackground={true}
      heroType="animated"
      backgroundType="contact"
      breadcrumbs={[
        { label: 'Contact', path: '/contact' }
      ]}
    >

      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text dark:text-white mb-2">Email</h3>
                <p className="text-text-secondary dark:text-gray-300">support@socialcaution.com</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text dark:text-white mb-2">Phone</h3>
                <p className="text-text-secondary dark:text-gray-300">+1 (555) 123-4567</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text dark:text-white mb-2">Address</h3>
                <p className="text-text-secondary dark:text-gray-300 whitespace-pre-line">
                  123 Privacy Street
                  Suite 100
                  San Francisco, CA 94105
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-text dark:text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full pl-10 p-3 bg-card dark:bg-card-hover border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 p-3 bg-card dark:bg-card-hover border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                    className="w-full pl-10 p-3 bg-card dark:bg-card-hover border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text dark:text-white"
                  ></textarea>
                </div>
              </div>

              {/* Submit Status Messages */}
              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  <span>Message sent successfully!</span>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                  <AlertCircle className="h-5 w-5" />
                  <span>Failed to send message. Please try again.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ContactPage;
