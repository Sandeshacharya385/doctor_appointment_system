'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Appointment } from '@/types';

// ── Change this to your WhatsApp number (with country code, no + or spaces) ──
const WHATSAPP_NUMBER = '9779800000000';

function buildWhatsAppURL(appt: Appointment): string {
  const doctor = `Dr. ${appt.doctor_details?.user?.first_name} ${appt.doctor_details?.user?.last_name}`;
  const fee = appt.doctor_details?.consultation_fee ?? '—';
  const msg = encodeURIComponent(
    `Hello, I would like to confirm payment for my appointment.\n\n` +
    `👨‍⚕️ Doctor: ${doctor}\n` +
    `🏥 Specialization: ${appt.doctor_details?.specialization}\n` +
    `📅 Date: ${appt.appointment_date}\n` +
    `🕐 Time: ${appt.appointment_time?.slice(0, 5)}\n` +
    `💰 Fee: $${fee}\n` +
    `📋 Reason: ${appt.reason}\n\n` +
    `Please confirm my payment. Thank you!`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export default function PaymentsPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<number | null>(null);

  useEffect(() => {
    api.get('/appointments/')
      .then(r => setAppointments(r.data.results || r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePayViaWhatsApp = (appt: Appointment) => {
    setPaying(appt.id);
    const url = buildWhatsAppURL(appt);
    window.open(url, '_blank');
    setTimeout(() => setPaying(null), 2000);
  };

  const statusBadge: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending:   'bg-amber-100 text-amber-700',
    cancelled: 'bg-slate-200 text-slate-600',
    completed: 'bg-blue-100 text-blue-700',
  };

  const payableStatuses = ['confirmed', 'pending'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Payments</h2>
          <p className="text-sm text-slate-500 mt-1">
            Pay for your appointments via WhatsApp
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          {/* WhatsApp icon SVG */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-800">Pay via WhatsApp</p>
          <p className="text-xs text-green-700 mt-0.5">
            Click "Pay via WhatsApp" on any appointment to send a payment confirmation message directly to our clinic. We'll confirm your payment and appointment.
          </p>
        </div>
      </div>

      {/* Appointments list */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-16 text-center">
          <span className="material-symbols-outlined text-[56px] text-slate-300 mb-4 block">payments</span>
          <p className="text-slate-500 font-medium">No appointments to pay for</p>
          <p className="text-slate-400 text-sm mt-1">Book an appointment first</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(appt => {
            const canPay = payableStatuses.includes(appt.status);
            return (
              <div key={appt.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Doctor avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {appt.doctor_details?.user?.first_name?.[0] || 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Dr. {appt.doctor_details?.user?.first_name} {appt.doctor_details?.user?.last_name}
                      </h3>
                      <p className="text-sm text-slate-500">{appt.doctor_details?.specialization}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-600">
                        <span className="flex items-center space-x-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          <span>{appt.appointment_date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>{appt.appointment_time?.slice(0, 5)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="material-symbols-outlined text-[14px]">info</span>
                          <span className="capitalize">{appt.reason?.slice(0, 30)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    {/* Fee */}
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Consultation Fee</p>
                      <p className="text-xl font-bold text-slate-900">
                        ${appt.doctor_details?.consultation_fee ?? '—'}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold capitalize ${statusBadge[appt.status]}`}>
                      {appt.status}
                    </span>

                    {/* Pay button */}
                    {canPay ? (
                      <button
                        onClick={() => handlePayViaWhatsApp(appt)}
                        disabled={paying === appt.id}
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-green-200"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span>{paying === appt.id ? 'Opening WhatsApp...' : 'Pay via WhatsApp'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        {appt.status === 'completed' ? 'Payment completed' : 'Not payable'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      <div className="bg-slate-50 rounded-xl p-4 text-center">
        <p className="text-xs text-slate-500">
          Payments are processed manually via WhatsApp. After sending the message, our team will confirm your payment within 24 hours.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          WhatsApp: +{WHATSAPP_NUMBER}
        </p>
      </div>
    </div>
  );
}
