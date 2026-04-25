export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  profile_picture?: string;
}

export interface Doctor {
  id: number;
  user: User;
  specialization: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  bio: string;
  is_available: boolean;
  availability: DoctorAvailability[];
}

export interface DoctorAvailability {
  id: number;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface Appointment {
  id: number;
  patient: User;
  doctor: number;
  doctor_details: Doctor;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
