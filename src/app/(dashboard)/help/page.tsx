'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active: boolean;
}

export default function HelpPage() {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: 'general',
    description: '',
  });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch FAQs from API
  useEffect(() => {
    fetchFAQs();
    fetchCategories();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await api.get('/faqs/');
      // Ensure we always set an array
      const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setFaqs(data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      setFaqs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/faqs/categories/');
      const data = Array.isArray(response.data) ? response.data : [];
      // Remove duplicates using Set
      const uniqueCategories = Array.from(new Set(data));
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories(['All']);
    }
  };

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the ticket to your backend
    alert(`Support ticket submitted!\n\nSubject: ${ticketData.subject}\nCategory: ${ticketData.category}\n\nWe'll get back to you within 24 hours.`);
    setShowTicketForm(false);
    setTicketData({ subject: '', category: 'general', description: '' });
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Help & Support</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get help with using MediBook</p>
      </div>

      <div className="space-y-6">
        {/* Contact Support */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Contact Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[24px]">email</span>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                <a href="mailto:support@medibook.com" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  support@medibook.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[24px]">phone</span>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                <a href="tel:+1234567890" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[24px]">schedule</span>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hours</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri, 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Frequently Asked Questions</h3>
            {categories.length > 1 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {categories.map((category, index) => (
                  <option key={`${category}-${index}`} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading FAQs...</p>
            </div>
          ) : !Array.isArray(filteredFaqs) || filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">No FAQs available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-200 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full ml-3 flex-shrink-0">
                      {faq.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Ticket */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Submit a Support Ticket</h3>
          
          {!showTicketForm ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Can't find what you're looking for? Submit a support ticket and we'll get back to you.
              </p>
              <button 
                onClick={() => setShowTicketForm(true)}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-800 dark:border-gray-700 font-semibold"
              >
                Create Ticket
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketData.subject}
                  onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Brief description of your issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="appointment">Appointment Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  value={ticketData.description}
                  onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Please provide details about your issue..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-800 dark:border-gray-700 font-semibold"
                >
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowTicketForm(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
