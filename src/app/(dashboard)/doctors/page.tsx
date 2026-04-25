'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Doctor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors/');
        setDoctors(response.data.results || response.data);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Available Doctors</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardHeader>
              <CardTitle>
                Dr. {doctor.user.first_name} {doctor.user.last_name}
              </CardTitle>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Qualification:</strong> {doctor.qualification}</p>
                <p className="text-sm"><strong>Experience:</strong> {doctor.experience_years} years</p>
                <p className="text-sm"><strong>Fee:</strong> ${doctor.consultation_fee}</p>
                {doctor.bio && <p className="text-sm text-gray-600">{doctor.bio}</p>}
                
                <Link href={`/appointments/book?doctor=${doctor.id}`}>
                  <Button className="w-full mt-4">Book Appointment</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
