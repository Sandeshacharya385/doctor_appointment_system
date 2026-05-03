'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { Doctor, TimeSlot } from '@/types';
import { toast } from 'sonner';

const schema = z.object({
  appointment_date: z.string().min(1, 'Select a date'),
  reason: z.string().min(5, 'Please describe your reason (min 5 chars)'),
});
type FormData = z.infer<typeof schema>;

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctor');

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMsg, setSlotsMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedDate = watch('appointment_date');

  // Load doctor info
  useEffect(() => {
    if (doctorId) {
      api.get(`/doctors/${doctorId}/`).then(r => setDoctor(r.data)).catch(() => {
        toast.error('Failed to load doctor information');
      });
    }
  }, [doctorId]);

  // Load available slots when date changes
  useEffect(() => {
    if (!doctorId || !selectedDate) { setSlots([]); setSelectedTime(''); return; }
    setSlotsLoading(true);
    setSlotsMsg('');
    setSelectedTime('');
    api.get(`/doctors/${doctorId}/slots/?date=${selectedDate}`)
      .then(r => {
        setSlots(r.data.slots || []);
        if (r.data.message) {
          setSlotsMsg(r.data.message);
          toast.info(r.data.message);
        }
      })
      .catch(() => {
        const msg = 'Could not load slots.';
        setSlotsMsg(msg);
        toast.error(msg);
      })
      .finally(() => setSlotsLoading(false));
  }, [doctorId, selectedDate]);

  const onSubmit = async (data: FormData) => {
    if (!selectedTime) { 
      const errorMsg = 'Please select a time slot.';
      setError(errorMsg); 
      toast.error(errorMsg);
      return; 
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/appointments/', {
        doctor: doctorId,
        appointment_date: data.appointment_date,
        appointment_time: selectedTime,
        reason: data.reason,
      });
      
      toast.success('Appointment Booked Successfully!', {
        description: `Your appointment is scheduled for ${data.appointment_date} at ${selectedTime}`,
      });
      
      router.push('/appointments');
    } catch (e: any) {
      const msg = e.response?.data;
      let errorMsg = '';
      if (typeof msg === 'object') {
        errorMsg = Object.values(msg).flat().join(' ');
      } else {
        errorMsg = 'Booking failed. Please try again.';
      }
      setError(errorMsg);
      toast.error('Booking Failed', {
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Book Appointment</h2>
        <p className="text-sm text-slate-500 mt-1">Select a date and available time slot</p>
      </div>

      {/* Doctor card */}
      {doctor && (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-5 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
            {doctor.user.first_name[0]}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Dr. {doctor.user.first_name} {doctor.user.last_name}</h3>
            <p className="text-sm text-slate-500">{doctor.specialization} · {doctor.qualification}</p>
            <p className="text-sm font-semibold text-blue-600 mt-1">${doctor.consultation_fee} consultation fee</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Experience</p>
            <p className="font-bold text-slate-900">{doctor.experience_years} yrs</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-6 space-y-5">

        {/* Date picker */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
          <input type="date" {...register('appointment_date')} min={today}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {errors.appointment_date && <p className="text-red-500 text-xs mt-1">{errors.appointment_date.message}</p>}
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Available Time Slots</label>
            {slotsLoading ? (
              <p className="text-slate-400 text-sm">Loading slots...</p>
            ) : slotsMsg ? (
              <p className="text-amber-600 text-sm font-medium">{slotsMsg}</p>
            ) : slots.length === 0 ? (
              <p className="text-slate-400 text-sm">No slots available for this date.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.map(slot => (
                  <button key={slot.time} type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      !slot.available
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                        : selectedTime === slot.time
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}>
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for Visit</label>
          <textarea {...register('reason')} rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            placeholder="Describe your symptoms or reason for the visit..." />
          {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button type="button" onClick={() => router.back()}
            className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all">
            Back
          </button>
          <button type="submit" disabled={loading || !selectedTime}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition-all">
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
