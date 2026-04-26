'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Appointment, DoctorAvailability, Medicine } from '@/types';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const FREQS = [
  { value: 'once_daily',        label: 'Once Daily' },
  { value: 'twice_daily',       label: 'Twice Daily' },
  { value: 'three_times_daily', label: 'Three Times Daily' },
  { value: 'four_times_daily',  label: 'Four Times Daily' },
  { value: 'every_morning',     label: 'Every Morning' },
  { value: 'every_night',       label: 'Every Night' },
  { value: 'before_meal',       label: 'Before Meal' },
  { value: 'after_meal',        label: 'After Meal' },
  { value: 'as_needed',         label: 'As Needed' },
];
const SB: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending:   'bg-amber-100 text-amber-700',
  cancelled: 'bg-slate-200 text-slate-600',
  completed: 'bg-blue-100 text-blue-700',
};

interface HistEntry {
  id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  notes: string;
  doctor_name: string;
  specialization: string;
  is_followup: boolean;
  prescription: { diagnosis: string; instructions: string; medicines: Medicine[] } | null;
}
interface PatHist {
  patient: { id: number; name: string; email: string; phone: string };
  total_visits: number;
  history: HistEntry[];
}
type Tab = 'appointments' | 'schedule' | 'profile';
const blank = (): Medicine => ({ name: '', dosage: '', frequency: 'once_daily', duration_days: 7, timing_notes: '' });

export default function DoctorPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hist, setHist] = useState<PatHist | null>(null);
  const [histLoading, setHistLoading] = useState(false);
  const [rx, setRx] = useState<Appointment | null>(null);
  const [diag, setDiag] = useState('');
  const [instr, setInstr] = useState('');
  const [meds, setMeds] = useState<Medicine[]>([blank()]);
  const [rxSaving, setRxSaving] = useState(false);
  const [rxMsg, setRxMsg] = useState('');
  const [slots, setSlots] = useState<DoctorAvailability[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [newSlot, setNewSlot] = useState({ day_of_week: 0, start_time: '09:00', end_time: '17:00' });
  const [slotMsg, setSlotMsg] = useState('');
  const [fee, setFee] = useState('');
  const [bio, setBio] = useState('');
  const [spec, setSpec] = useState('');
  const [avail, setAvail] = useState(true);
  const [profMsg, setProfMsg] = useState('');

  useEffect(() => {
    api.get('/appointments/').then(r => setAppointments(r.data.results || r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'schedule') {
      setSlotsLoading(true);
      api.get('/doctors/availability/').then(r => setSlots(r.data)).finally(() => setSlotsLoading(false));
    }
    if (tab === 'profile') {
      api.get('/doctors/profile/').then(r => {
        setFee(String(r.data.consultation_fee)); setBio(r.data.bio || '');
        setSpec(r.data.specialization || ''); setAvail(r.data.is_available);
      });
    }
  }, [tab]);

  const setStatus = async (id: number, s: string) => {
    await api.patch(`/appointments/${id}/`, { status: s });
    setAppointments(p => p.map(a => a.id === id ? { ...a, status: s as Appointment['status'] } : a));
  };

  const loadHist = async (pid: number) => {
    setHistLoading(true); setHist(null);
    try { const r = await api.get(`/appointments/patient-history/${pid}/`); setHist(r.data); }
    catch { setHist(null); } finally { setHistLoading(false); }
  };

  const openRx = (appt: Appointment) => {
    setRx(appt); setRxMsg('');
    if (appt.prescription) {
      setDiag(appt.prescription.diagnosis); setInstr(appt.prescription.instructions);
      setMeds(appt.prescription.medicines.length > 0 ? appt.prescription.medicines : [blank()]);
    } else { setDiag(''); setInstr(''); setMeds([blank()]); }
  };

  const updMed = (i: number, f: keyof Medicine, v: string | number) =>
    setMeds(p => p.map((m, idx) => idx === i ? { ...m, [f]: v } : m));

  const saveRx = async () => {
    if (!rx) return; setRxSaving(true);
    try {
      await api.post(`/appointments/${rx.id}/prescription/`, { diagnosis: diag, instructions: instr, medicines: meds });
      setRxMsg('Prescription saved!');
      const r = await api.get('/appointments/'); setAppointments(r.data.results || r.data);
      setTimeout(() => { setRx(null); setRxMsg(''); }, 1500);
    } catch (e: any) { setRxMsg(e.response?.data?.error || 'Failed to save.'); }
    finally { setRxSaving(false); }
  };

  const addSlot = async () => {
    setSlotMsg('');
    try { const r = await api.post('/doctors/availability/', newSlot); setSlots(p => [...p, r.data]); setSlotMsg('Slot added!'); }
    catch (e: any) { setSlotMsg(e.response?.data?.non_field_errors?.[0] || 'Failed.'); }
  };
  const delSlot = async (id: number) => { await api.delete(`/doctors/availability/${id}/`); setSlots(p => p.filter(s => s.id !== id)); };
  const togSlot = async (slot: DoctorAvailability) => {
    const r = await api.patch(`/doctors/availability/${slot.id}/`, { is_active: !slot.is_active });
    setSlots(p => p.map(s => s.id === slot.id ? r.data : s));
  };
  const saveProf = async () => {
    setProfMsg('');
    try { await api.patch('/doctors/profile/', { consultation_fee: fee, bio, specialization: spec, is_available: avail }); setProfMsg('Profile updated!'); }
    catch { setProfMsg('Failed to update.'); }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Doctor Panel</h2>
          <p className="text-sm text-slate-500 mt-1">Dr. {user?.first_name} {user?.last_name}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${avail ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
          {avail ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['appointments','schedule','profile'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex space-x-2 flex-wrap gap-y-2">
            {['all','pending','confirmed','completed','cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}>
                {s} {s !== 'all' && `(${appointments.filter(a => a.status === s).length})`}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center text-slate-400 shadow-sm border border-slate-50">
              <span className="material-symbols-outlined text-[48px] mb-3 block">event_busy</span>
              <p>No {filter !== 'all' ? filter : ''} appointments</p>
            </div>
          ) : filtered.map(appt => (
            <div key={appt.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {appt.patient?.first_name?.[0] || 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{appt.patient?.first_name} {appt.patient?.last_name || appt.patient?.username}</h3>
                    <p className="text-xs text-slate-500">{appt.patient?.email}</p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-slate-600">
                      <span className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        <span>{appt.appointment_date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{appt.appointment_time?.slice(0, 5)}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Reason: {appt.reason}</p>
                    {appt.prescription && (
                      <span className="inline-flex items-center space-x-1 mt-2 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                        <span className="material-symbols-outlined text-[12px]">medication</span>
                        <span>Prescription given</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold capitalize ${SB[appt.status]}`}>{appt.status}</span>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button onClick={() => loadHist(appt.patient?.id)}
                      className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-200 transition-all flex items-center space-x-1">
                      <span className="material-symbols-outlined text-[14px]">history</span>
                      <span>History</span>
                    </button>
                    {appt.status === 'pending' && (
                      <button onClick={() => setStatus(appt.id, 'confirmed')}
                        className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-600 transition-all">Confirm</button>
                    )}
                    {(appt.status === 'pending' || appt.status === 'confirmed') && (
                      <button onClick={() => setStatus(appt.id, 'cancelled')}
                        className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition-all">Cancel</button>
                    )}
                    {appt.status === 'confirmed' && (
                      <button onClick={() => openRx(appt)}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">medication</span>
                        <span>Prescribe</span>
                      </button>
                    )}
                    {appt.status === 'completed' && (
                      <button onClick={() => openRx(appt)}
                        className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-200 transition-all">Edit Rx</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Availability Slot</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Day of Week</label>
                <select value={newSlot.day_of_week} onChange={e => setNewSlot(p => ({ ...p, day_of_week: +e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start Time</label>
                  <input type="time" value={newSlot.start_time} onChange={e => setNewSlot(p => ({ ...p, start_time: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">End Time</label>
                  <input type="time" value={newSlot.end_time} onChange={e => setNewSlot(p => ({ ...p, end_time: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>
              {slotMsg && <p className={`text-xs font-medium ${slotMsg.includes('!') ? 'text-emerald-600' : 'text-red-500'}`}>{slotMsg}</p>}
              <button onClick={addSlot} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all">Add Slot</button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Availability</h3>
            {slotsLoading ? <p className="text-slate-400 text-sm">Loading...</p> : slots.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No slots added yet</p>
            ) : (
              <div className="space-y-3">
                {slots.map(slot => (
                  <div key={slot.id} className={`flex items-center justify-between p-3 rounded-lg border ${slot.is_active ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{slot.day_name}</p>
                      <p className="text-xs text-slate-500">{slot.start_time} to {slot.end_time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => togSlot(slot)}
                        className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${slot.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                        {slot.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => delSlot(slot.id)} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold hover:bg-red-200 transition-all">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div className="max-w-lg">
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-6 space-y-5">
            <h3 className="text-lg font-semibold text-slate-900">Update Profile</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Specialization</label>
              <input value={spec} onChange={e => setSpec(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="e.g. Cardiologist" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Consultation Fee ($)</label>
              <input type="number" value={fee} onChange={e => setFee(e.target.value)} min="0" step="0.01" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="e.g. 150.00" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" placeholder="Tell patients about yourself..." />
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setAvail(!avail)} className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${avail ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${avail ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-sm font-medium text-slate-700">{avail ? 'Available for appointments' : 'Not accepting appointments'}</span>
            </div>
            {profMsg && <p className={`text-xs font-medium ${profMsg.includes('!') ? 'text-emerald-600' : 'text-red-500'}`}>{profMsg}</p>}
            <button onClick={saveProf} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all">Save Changes</button>
          </div>
        </div>
      )}

      {/* Patient History Modal */}
      {(histLoading || hist) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Patient Medical History</h3>
                {hist && <p className="text-sm text-slate-500 mt-0.5">{hist.patient.name} &bull; {hist.total_visits} visit{hist.total_visits !== 1 ? 's' : ''}</p>}
              </div>
              <button onClick={() => setHist(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full font-bold text-lg">x</button>
            </div>
            <div className="p-6">
              {histLoading ? (
                <div className="text-center py-12 text-slate-400 text-sm">Loading patient history...</div>
              ) : hist ? (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-4 flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl flex-shrink-0">{hist.patient.name[0]}</div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-lg">{hist.patient.name}</p>
                      <p className="text-sm text-slate-500">{hist.patient.email}</p>
                      {hist.patient.phone && <p className="text-sm text-slate-500">{hist.patient.phone}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">{hist.total_visits}</p>
                      <p className="text-xs text-slate-500">Total Visits</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Visit Timeline (newest first)</p>
                    <div className="space-y-4">
                      {hist.history.map((entry, idx) => (
                        <div key={entry.id} className={`rounded-xl border p-5 ${entry.is_followup ? 'border-purple-200 bg-purple-50' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${entry.is_followup ? 'bg-purple-200 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {hist.total_visits - idx}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                  <p className="font-semibold text-slate-900 text-sm">{entry.appointment_date}</p>
                                  <span className="text-slate-400 text-xs">{entry.appointment_time?.slice(0, 5)}</span>
                                  {entry.is_followup && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Follow-up</span>}
                                </div>
                                <p className="text-xs text-slate-500">{entry.doctor_name} &bull; {entry.specialization}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold capitalize flex-shrink-0 ${SB[entry.status]}`}>{entry.status}</span>
                          </div>
                          <div className="ml-11 space-y-3">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reason for Visit</p>
                              <p className="text-sm text-slate-700 mt-0.5">{entry.reason}</p>
                            </div>
                            {entry.notes && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Doctor Notes</p>
                                <p className="text-sm text-slate-700 mt-0.5">{entry.notes}</p>
                              </div>
                            )}
                            {entry.prescription && (
                              <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
                                <div className="flex items-center space-x-2">
                                  <span className="material-symbols-outlined text-blue-600 text-[18px]">medication</span>
                                  <p className="text-sm font-semibold text-slate-800">Prescription</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Diagnosis</p>
                                  <p className="text-sm text-slate-800 mt-0.5 font-medium">{entry.prescription.diagnosis}</p>
                                </div>
                                {entry.prescription.instructions && (
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Instructions</p>
                                    <p className="text-sm text-slate-600 mt-0.5">{entry.prescription.instructions}</p>
                                  </div>
                                )}
                                {entry.prescription.medicines?.length > 0 && (
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Medicines</p>
                                    <div className="space-y-2">
                                      {entry.prescription.medicines.map((med: Medicine, mi: number) => (
                                        <div key={mi} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                                          <div>
                                            <p className="text-sm font-semibold text-slate-900">{med.name}</p>
                                            <p className="text-xs text-slate-500">{med.dosage}{med.timing_notes ? ` — ${med.timing_notes}` : ''}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-xs font-bold text-blue-700">{med.frequency_display || med.frequency}</p>
                                            <p className="text-[10px] text-slate-400">{med.duration_days} days</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : <div className="text-center py-12 text-slate-400 text-sm">No history found.</div>}
            </div>
          </div>
        </div>
      )}
