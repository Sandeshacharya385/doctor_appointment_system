'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  working_hours: string;
  emergency_contact?: string;
}

export default function AboutPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await api.get('/settings/contact/current/');
      setContactInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
      // Set default values if API fails
      setContactInfo({
        email: 'support@medibook.com',
        phone: '+1 (234) 567-890',
        address: '123 Healthcare Ave, Medical District, City, State 12345',
        working_hours: 'Mon-Fri, 9AM-6PM',
        emergency_contact: '+1 (234) 567-999'
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">About MediBook</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Healthcare management made simple</p>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-gray-900 dark:bg-gray-800 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[32px]">medical_services</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">MediBook</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              MediBook is a comprehensive healthcare management platform designed to revolutionize the way patients, 
              doctors, and healthcare administrators interact. Founded with a vision to make quality healthcare 
              accessible to everyone, we leverage cutting-edge technology to bridge the gap between medical 
              professionals and patients.
            </p>
            <p>
              Our platform streamlines the entire healthcare journey—from finding the right doctor and booking 
              appointments to managing prescriptions and maintaining complete medical records. We understand that 
              healthcare can be complex and overwhelming, which is why we've built MediBook to be intuitive, 
              secure, and patient-centered.
            </p>
            <p>
              With MediBook, patients can take control of their health by easily scheduling appointments, 
              accessing their medical history, receiving timely reminders, and communicating with healthcare 
              providers—all from a single, unified platform. For healthcare professionals, we provide powerful 
              tools to manage patient appointments, maintain detailed medical records, issue digital prescriptions, 
              and deliver better care more efficiently.
            </p>
            <p>
              We are committed to maintaining the highest standards of data security and privacy, ensuring that 
              all patient information is protected with enterprise-grade encryption and complies with healthcare 
              regulations including HIPAA. Your health data is yours, and we take every measure to keep it safe 
              and confidential.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Our Mission & Vision</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[20px]">flag</span>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Mission</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed ml-7">
                To empower individuals with seamless access to quality healthcare by providing an innovative, 
                user-friendly platform that connects patients with healthcare providers, simplifies medical 
                management, and promotes better health outcomes for all.
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[20px]">visibility</span>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Vision</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed ml-7">
                To become the leading healthcare management platform globally, transforming the healthcare 
                experience through technology, making quality medical care accessible, affordable, and efficient 
                for everyone, everywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">health_and_safety</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Patient-Centered Care</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We put patients first in everything we do, ensuring their needs, comfort, and well-being are our top priority.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]">security</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Privacy & Security</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We maintain the highest standards of data protection, ensuring all medical information remains confidential and secure.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">lightbulb</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Innovation</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We continuously evolve and adopt new technologies to improve healthcare delivery and patient experience.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-[18px]">diversity_3</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Accessibility</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We believe quality healthcare should be accessible to everyone, regardless of location or background.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[18px]">verified</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Quality Excellence</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We are committed to delivering the highest quality of service in every interaction and feature.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[18px]">handshake</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Trust & Transparency</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We build lasting relationships through honest communication and transparent practices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[24px]">event</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Appointment Management</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Easy booking and scheduling</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[24px]">medication</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Prescription Tracking</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Digital prescription management</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[24px]">payments</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Secure Payments</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Safe and convenient transactions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[24px]">notifications</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Smart Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Stay updated with reminders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team & Contact */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Contact Information</h3>
          {loading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading contact information...</p>
            </div>
          ) : contactInfo ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[20px]">email</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[20px]">phone</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
              {contactInfo.emergency_contact && (
                <div className="flex items-start space-x-3">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[20px]">emergency</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact</p>
                    <a href={`tel:${contactInfo.emergency_contact}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      {contactInfo.emergency_contact}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[20px]">location_on</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[20px]">schedule</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Working Hours</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contactInfo.working_hours}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Contact information not available.</p>
          )}
        </div>

        {/* Legal */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Legal</h3>
          <div className="flex flex-wrap gap-4">
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:underline">
              Terms of Service
            </button>
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:underline">
              Privacy Policy
            </button>
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:underline">
              Cookie Policy
            </button>
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:underline">
              HIPAA Compliance
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 MediBook Healthcare System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
