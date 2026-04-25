'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const bookingSchema = z.object({
  doctor: z.string(),
  appointment_date: z.string(),
  appointment_time: z.string(),
  reason: z.string().min(10, 'Please provide a detailed reason'),
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    if (doctorId) {
      setValue('doctor', doctorId);
    }
  }, [doctorId, setValue]);

  const onSubmit = async (data: BookingForm) => {
    setLoading(true);
    setError('');
    
    try {
      await api.post('/appointments/', data);
      router.push('/appointments');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Book Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <input type="hidden" {...register('doctor')} />
            
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input {...register('appointment_date')} type="date" />
              {errors.appointment_date && <p className="text-red-500 text-sm mt-1">{errors.appointment_date.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <Input {...register('appointment_time')} type="time" />
              {errors.appointment_time && <p className="text-red-500 text-sm mt-1">{errors.appointment_time.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Reason for Visit</label>
              <textarea
                {...register('reason')}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                placeholder="Describe your symptoms or reason for visit"
              />
              {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
