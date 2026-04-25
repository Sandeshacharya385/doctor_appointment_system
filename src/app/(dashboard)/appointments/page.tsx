'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Appointment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments/');
        setAppointments(response.data.results || response.data);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
      
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>
                  Dr. {appointment.doctor_details.user.first_name} {appointment.doctor_details.user.last_name}
                </CardTitle>
                <p className="text-sm text-gray-600">{appointment.doctor_details.specialization}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Date:</strong> {format(new Date(appointment.appointment_date), 'PPP')}</p>
                  <p><strong>Time:</strong> {appointment.appointment_time}</p>
                  <p><strong>Status:</strong> <span className="capitalize">{appointment.status}</span></p>
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                  {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
