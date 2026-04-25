'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appointments: 0,
    doctors: 0,
  });

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        // Fetch user profile if not already loaded
        if (!user) {
          const userResponse = await api.get('/auth/profile/');
          setUser(userResponse.data);
        }

        // Fetch appointments count
        const appointmentsResponse = await api.get('/appointments/');
        const appointments = appointmentsResponse.data.results || appointmentsResponse.data;
        
        // Fetch doctors count
        const doctorsResponse = await api.get('/doctors/');
        const doctors = doctorsResponse.data.results || doctorsResponse.data;

        setStats({
          appointments: Array.isArray(appointments) ? appointments.length : 0,
          doctors: Array.isArray(doctors) ? doctors.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, [user, setUser]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.first_name || user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'patient' && 'Manage your appointments and find doctors'}
          {user?.role === 'doctor' && 'View and manage your patient appointments'}
          {user?.role === 'admin' && 'System administration dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{stats.appointments}</div>
            <p className="text-sm text-gray-600 mb-4">
              {user?.role === 'patient' ? 'Booked appointments' : 'Patient appointments'}
            </p>
            <Link href="/appointments">
              <Button variant="outline" className="w-full">View All</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{stats.doctors}</div>
            <p className="text-sm text-gray-600 mb-4">Doctors available for booking</p>
            <Link href="/doctors">
              <Button variant="outline" className="w-full">Browse Doctors</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user?.role === 'patient' && (
                <>
                  <Link href="/doctors">
                    <Button className="w-full">Book Appointment</Button>
                  </Link>
                  <Link href="/appointments">
                    <Button variant="outline" className="w-full">My Appointments</Button>
                  </Link>
                </>
              )}
              {user?.role === 'doctor' && (
                <>
                  <Link href="/appointments">
                    <Button className="w-full">View Appointments</Button>
                  </Link>
                  <Button variant="outline" className="w-full">Update Availability</Button>
                </>
              )}
              {user?.role === 'admin' && (
                <a href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">Admin Panel</Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Name:</span> {user?.first_name} {user?.last_name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {user?.email}
              </div>
              <div>
                <span className="font-semibold">Role:</span> <span className="capitalize">{user?.role}</span>
              </div>
              {user?.phone && (
                <div>
                  <span className="font-semibold">Phone:</span> {user.phone}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
