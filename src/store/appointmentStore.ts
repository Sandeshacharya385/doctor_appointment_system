import { create } from 'zustand';
import { Appointment } from '@/types';

interface AppointmentState {
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: number, appointment: Partial<Appointment>) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  updateAppointment: (id, updatedAppointment) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, ...updatedAppointment } : apt
      ),
    })),
}));
