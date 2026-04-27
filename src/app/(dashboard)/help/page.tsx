'use client';

import { useState } from 'react';

export default function HelpPage() {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: 'general',
    description: '',
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the ticket to your backend
    alert(`Support ticket submitted!\n\nSubject: ${ticketData.subject}\nCategory: ${ticketData.category}\n\nWe'll get back to you within 24 hours.`);
    setShowTicketForm(false);
    setTicketData({ subject: '', category: 'general', description: '' });
  };

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'Navigate to "Find Doctors", select a doctor, choose an available time slot, and confirm your booking.',
    },
    {
      question: 'How can I view my prescriptions?',
      answer: 'Go to the "Prescriptions" page from the sidebar to view all your current and past prescriptions.',
    },
    {
      question: 'How do I make a payment?',
      answer: 'Visit the "Payments" section to view pending payments and complete transactions securely.',
    },
    {
      question: 'Can I cancel or reschedule an appointment?',
      answer: 'Yes, go to "Appointments", find your booking, and use the cancel or reschedule options.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Click on "Profile Settings" in the sidebar to update your personal information.',
    },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-1">Get help with using MediBook</p>
      </div>

      <div className="space-y-6">
        {/* Contact Support */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Contact Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[24px]">email</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <a href="mailto:support@medibook.com" className="text-sm text-blue-600 hover:underline">
                  support@medibook.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[24px]">phone</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <a href="tel:+1234567890" className="text-sm text-blue-600 hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[24px]">schedule</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Hours</p>
                <p className="text-sm text-gray-600">Mon-Fri, 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Ticket */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Submit a Support Ticket</h3>
          
          {!showTicketForm ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Can't find what you're looking for? Submit a support ticket and we'll get back to you.
              </p>
              <button 
                onClick={() => setShowTicketForm(true)}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Create Ticket
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketData.subject}
                  onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="appointment">Appointment Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={ticketData.description}
                  onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Please provide details about your issue..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowTicketForm(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
