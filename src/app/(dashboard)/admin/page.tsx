'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

type Tab = 'doctors' | 'patients' | 'appointments' | 'add-doctor';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('doctors');
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Add doctor form
  const [form, setForm] = useState({
    username: '', email: '', password: '', first_name: '', last_name: '',
    phone: '', specialization: '', qualification: '', experience_years: '',
    consultation_fee: '', bio: '',
  });

  const loadDoctors = () => {
    setLoading(true);
    api.get('/auth/admin/users/?role=doctor').then(r => setDoctors(r.data)).finally(() => setLoading(false));
  };
  const loadPatients = () => {
    setLoading(true);
    api.get('/auth/admin/users/?role=patient').then(r => setPatients(r.data)).finally(() => setLoading(false));
  };
  const loadAppointments = () => {
    setLoading(true);
    api.get('/appointments/').then(r => setAppointments(r.data.results || r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'doctors') loadDoctors();
    else if (tab === 'patients') loadPatients();
    else if (tab === 'appointments') loadAppointments();
  }, [tab]);

  const deleteUser = async (id: number, role: string) => {
    if (!confirm(`Delete this ${role}? This cannot be undone.`)) return;
    try {
      await api.delete(`/auth/admin/users/${id}/`);
      if (role === 'doctor') setDoctors(prev => prev.filter(u => u.id !== id));
      else setPatients(prev => prev.filter(u => u.id !== id));
      setMsg(`${role} deleted.`);
    } catch (e: any) {
      setMsg(e.response?.data?.error || 'Delete failed.');
    }
  };

  const addDoctor = async () => {
    setMsg('');
    try {
      await api.post('/auth/admin/create-doctor/', {
        ...form,
        experience_years: +form.experience_years,
        consultation_fee: +form.consultation_fee,
      });
      setMsg('Doctor created successfully!');
      setForm({ username:'',email:'',password:'',first_name:'',last_name:'',phone:'',specialization:'',qualification:'',experience_years:'',consultation_fee:'',bio:'' });
      loadDoctors();
    } catch (e: any) {
      const err = e.response?.data;
      if (typeof err === 'object') setMsg(Object.values(err).flat().join(' '));
      else setMsg('Failed to create doctor.');
    }
  };

  const statusBadge: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending:   'bg-amber-100 text-amber-700',
    cancelled: 'bg-slate-200 text-slate-600',
    completed: 'bg-blue-100 text-blue-700',
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'doctors',     label: 'Doctors',      icon: 'stethoscope' },
    { key: 'patients',    label: 'Patients',      icon: 'person' },
    { key: 'appointments',label: 'Appointments',  icon: 'event' },
    { key: 'add-doctor',  label: 'Add Doctor',    icon: 'person_add' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>
        <p className="text-sm text-slate-500 mt-1">Full system control — manage doctors, patients and appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Doctors',  value: doctors.length,      icon: 'stethoscope', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total Patients', value: patients.length,     icon: 'person',      color: 'bg-blue-50 text-blue-600' },
          { label: 'Appointments',   value: appointments.length, icon: 'event',       color: 'bg-purple-50 text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setMsg(''); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}>
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.includes('success') || msg.includes('deleted') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg}
        </div>
      )}

      {/* ── DOCTORS ── */}
      {tab === 'doctors' && (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">All Doctors ({doctors.length})</h3>
            <button onClick={() => setTab('add-doctor')}
              className="text-xs bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all flex items-center space-x-1">
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Add Doctor</span>
            </button>
          </div>
          {loading ? <div className="p-8 text-center text-slate-400 text-sm">Loading...</div> : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-6 py-3">Doctor</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          {doc.first_name?.[0] || 'D'}
                        </div>
                        <span className="font-semibold text-sm text-slate-900">{doc.first_name} {doc.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{doc.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">@{doc.username}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteUser(doc.id, 'doctor')}
                        className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition-all">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">No doctors found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── PATIENTS ── */}
      {tab === 'patients' && (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">All Patients ({patients.length})</h3>
          </div>
          {loading ? <div className="p-8 text-center text-slate-400 text-sm">Loading...</div> : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(pat => (
                  <tr key={pat.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {pat.first_name?.[0] || 'P'}
                        </div>
                        <span className="font-semibold text-sm text-slate-900">{pat.first_name} {pat.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{pat.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">@{pat.username}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteUser(pat.id, 'patient')}
                        className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition-all">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">No patients found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── APPOINTMENTS ── */}
      {tab === 'appointments' && (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">All Appointments ({appointments.length})</h3>
          </div>
          {loading ? <div className="p-8 text-center text-slate-400 text-sm">Loading...</div> : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Doctor</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Rx</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt: any) => (
                  <tr key={appt.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {appt.patient?.first_name} {appt.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      Dr. {appt.doctor_details?.user?.first_name} {appt.doctor_details?.user?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {appt.appointment_date} {appt.appointment_time?.slice(0,5)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold capitalize ${statusBadge[appt.status]}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {appt.prescription ? (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-bold">Given</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No appointments</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── ADD DOCTOR ── */}
      {tab === 'add-doctor' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-6 space-y-5">
            <h3 className="text-lg font-semibold text-slate-900">Add New Doctor</h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'first_name', label: 'First Name', type: 'text' },
                { key: 'last_name',  label: 'Last Name',  type: 'text' },
                { key: 'username',   label: 'Username',   type: 'text' },
                { key: 'email',      label: 'Email',      type: 'email' },
                { key: 'password',   label: 'Password',   type: 'password' },
                { key: 'phone',      label: 'Phone',      type: 'text' },
                { key: 'specialization', label: 'Specialization', type: 'text' },
                { key: 'qualification',  label: 'Qualification',  type: 'text' },
                { key: 'experience_years', label: 'Experience (years)', type: 'number' },
                { key: 'consultation_fee', label: 'Consultation Fee ($)', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <input type={f.type}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Bio</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                placeholder="Doctor's bio..." />
            </div>

            <button onClick={addDoctor}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-purple-700 transition-all">
              Create Doctor Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
