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
  const [expandedBios, setExpandedBios] = useState<Record<number, boolean>>({});

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

  const toggleBio = (doctorId: number) => {
    setExpandedBios(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }));
  };

  if (loading) return <div className="p-8 text-gray-400 dark:text-gray-500">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Available Doctors</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="dark:bg-gray-900 dark:border-gray-800 flex flex-col h-full">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">
                Dr. {doctor.user.first_name} {doctor.user.last_name}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-2 flex-1">
                <p className="text-sm dark:text-gray-300"><strong className="dark:text-gray-200">Qualification:</strong> {doctor.qualification}</p>
                <p className="text-sm dark:text-gray-300"><strong className="dark:text-gray-200">Experience:</strong> {doctor.experience_years} years</p>
                <p className="text-sm dark:text-gray-300"><strong className="dark:text-gray-200">Fee:</strong> ${doctor.consultation_fee}</p>
                
                {doctor.bio && (
                  <div className="pt-2">
                    <p className={`text-sm text-gray-600 dark:text-gray-400 ${!expandedBios[doctor.id] ? 'line-clamp-1' : ''}`}>
                      {doctor.bio}
                    </p>
                    {doctor.bio.length > 80 && (
                      <button
                        onClick={() => toggleBio(doctor.id)}
                        className="text-xs text-gray-900 dark:text-gray-100 hover:underline mt-1 font-medium"
                      >
                        {expandedBios[doctor.id] ? 'See less' : 'See more'}
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <Link href={`/appointments/book?doctor=${doctor.id}`} className="mt-4">
                <Button className="w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100">Book Appointment</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
