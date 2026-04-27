'use client';

export default function AboutPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">About MediBook</h1>
        <p className="text-sm text-gray-500 mt-1">Healthcare management made simple</p>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-gray-900 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[32px]">medical_services</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">MediBook</h2>
              <p className="text-sm text-gray-500">Version 1.0.0</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            MediBook is a comprehensive healthcare management platform designed to streamline the interaction
            between patients, doctors, and healthcare administrators. Our mission is to make healthcare
            accessible, efficient, and patient-centered.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[24px]">event</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Appointment Management</p>
                <p className="text-xs text-gray-500">Easy booking and scheduling</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[24px]">medication</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Prescription Tracking</p>
                <p className="text-xs text-gray-500">Digital prescription management</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[24px]">payments</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Secure Payments</p>
                <p className="text-xs text-gray-500">Safe and convenient transactions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[24px]">notifications</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Smart Notifications</p>
                <p className="text-xs text-gray-500">Stay updated with reminders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Next.js</p>
              <p className="text-xs text-gray-500">Frontend</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Django</p>
              <p className="text-xs text-gray-500">Backend</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">PostgreSQL</p>
              <p className="text-xs text-gray-500">Database</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Tailwind CSS</p>
              <p className="text-xs text-gray-500">Styling</p>
            </div>
          </div>
        </div>

        {/* Team & Contact */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[20px]">email</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <a href="mailto:info@medibook.com" className="text-sm text-blue-600 hover:underline">
                  info@medibook.com
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[20px]">language</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Website</p>
                <a href="https://medibook.com" className="text-sm text-blue-600 hover:underline">
                  www.medibook.com
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-gray-600 text-[20px]">location_on</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-sm text-gray-600">123 Healthcare Ave, Medical District</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
          <div className="flex flex-wrap gap-4">
            <button className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
              Terms of Service
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
              Privacy Policy
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
              Cookie Policy
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
              HIPAA Compliance
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            © 2024 MediBook Healthcare System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
