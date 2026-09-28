import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  ExternalLink,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  CalendarCheck,
  Edit3,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

interface MeetingType {
  id: string;
  name: string;
  duration: number; // in minutes (editable)
  description: string;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  defaultName = '',
}) => {
  // Constant contact info
  const CAL_USERNAME = 'Guilherme Carapinha_real';
  const OUTLOOK_EMAIL = 'ggcaa1@iscte-iul.pt';
  const CALCOM_URL = 'https://cal.com/guilherme_carapinha_real';

  // Base current reference date
  const now = useMemo(() => new Date(), []);

  // Helper to format Date as YYYY-MM-DD
  const formatDateKey = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 3 business days (dias úteis) immediately following today:
  // e.g. If today is Monday (Sep 28), the 3 business days are Tue (Sep 29), Wed (Sep 30), Thu (Oct 1).
  const occupiedBusinessDays = useMemo(() => {
    const result: string[] = [];
    const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    while (result.length < 3) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        result.push(formatDateKey(current));
      }
    }
    return result;
  }, [now]);

  // First available day after the 3 occupied business days (excluding weekends)
  const defaultAvailableDate = useMemo(() => {
    const current = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    while (true) {
      const dayOfWeek = current.getDay();
      const key = formatDateKey(current);
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !occupiedBusinessDays.includes(key)) {
        return key;
      }
      current.setDate(current.getDate() + 1);
    }
  }, [now, occupiedBusinessDays]);

  // Selected date string (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(defaultAvailableDate);
  const [selectedSlot, setSelectedSlot] = useState<string>('14:30');

  // Calendar month view state (opens on month of first available date)
  const [viewDate, setViewDate] = useState<Date>(() => {
    const parts = defaultAvailableDate.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
  });

  // User booked dates in the current session (no artificial 3-day recurring pattern!)
  const [userBookedDates, setUserBookedDates] = useState<string[]>([]);

  // Meeting types with EDITABLE duration (as requested)
  // Renamed "Parcerias & Projeto Didático" -> "Parcerias em Projetos" (as requested)
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([
    {
      id: 'rapida',
      name: 'Dúvidas Rápidas & Feedback',
      duration: 15,
      description: 'Esclarecimento breve sobre regras de submissão e temas.',
    },
    {
      id: 'revisao',
      name: 'Revisão Técnica 3D & Mentoria',
      duration: 30,
      description: 'Análise de polígonos, texturas e topologia no Blender.',
    },
    {
      id: 'parcerias',
      name: 'Parcerias em Projetos',
      duration: 45,
      description: 'Discussão sobre colaborações, propostas e expansão criativa.',
    },
  ]);

  const [selectedTypeId, setSelectedTypeId] = useState<string>('revisao');

  // Account Nickname & Reason & Email
  const [accountNickname, setAccountNickname] = useState(defaultName || '');
  const [meetingReason, setMeetingReason] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState(defaultEmail || '');

  // Booking completion state
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  // Selected meeting object
  const activeMeeting = meetingTypes.find((m) => m.id === selectedTypeId) || meetingTypes[1];

  // Duration editor handler
  const handleUpdateDuration = (newDuration: number) => {
    const val = Math.max(5, Math.min(180, isNaN(newDuration) ? 15 : newDuration));
    setMeetingTypes((prev) =>
      prev.map((t) => (t.id === selectedTypeId ? { ...t, duration: val } : t))
    );
  };

  // Month navigation
  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0, Sunday = 6

  // Time slots available
  const timeSlots = ['09:30', '11:00', '14:00', '14:30', '16:00', '17:30'];

  // Handle Booking submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `CAL-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    // Mark the selected day as booked
    setUserBookedDates((prev) => [...prev, selectedDate]);
    setIsBooked(true);
  };

  // Download .ics file
  const handleDownloadIcs = () => {
    const title = `Reunião: ${activeMeeting.name} (${activeMeeting.duration} min)`;
    const description = `Reunião marcada por ${accountNickname || 'Utilizador'} no Cal.com (@${CAL_USERNAME} - ${OUTLOOK_EMAIL}). Razão: ${meetingReason || activeMeeting.name}`;
    const cleanDate = selectedDate.replace(/-/g, '');
    const cleanTime = selectedSlot.replace(':', '') + '00';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Supercell Make Didático//Cal.com//PT',
      'BEGIN:VEVENT',
      `UID:${bookingRef || Date.now()}@cal.com`,
      `DTSTAMP:${cleanDate}T${cleanTime}`,
      `DTSTART:${cleanDate}T${cleanTime}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `ORGANIZER;CN=Guilherme Carapinha:mailto:${OUTLOOK_EMAIL}`,
      `ATTENDEE;CN=${accountNickname || 'Participante'}:mailto:${attendeeEmail || OUTLOOK_EMAIL}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reuniao-calcom-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#14121F] border border-gray-800 text-white w-full max-w-3xl rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Ambient background glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header - Simple & Clean without clutter */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-800/80 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold font-display border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cal.com
              </span>
              <span className="text-xs text-gray-400 font-medium">
                @{CAL_USERNAME} &bull; {OUTLOOK_EMAIL}
              </span>
              <a
                href={CALCOM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-300 transition inline-flex items-center ml-1"
                title="Abrir página oficial no Cal.com"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <h2 className="text-lg sm:text-xl font-black font-display text-white flex items-center gap-2">
              <span>Calendário de Agendamento</span>
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-full transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          {!isBooked ? (
            <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: O Calendário Interativo (7 cols) */}
              <div className="lg:col-span-7 space-y-3.5">
                {/* Month Navigator Bar */}
                <div className="flex items-center justify-between bg-gray-900/80 border border-gray-800 rounded-2xl px-3.5 py-2.5">
                  <div className="font-extrabold text-sm font-display text-white flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-indigo-400" />
                    <span>
                      {monthNames[month]} {year}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition cursor-pointer"
                      title="Mês anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition cursor-pointer"
                      title="Mês seguinte"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-gray-900/50 border border-gray-800/90 rounded-2xl p-3">
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((w) => (
                      <div key={w} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1">
                        {w}
                      </div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Empty placeholder cells for previous month offset */}
                    {Array.from({ length: firstDayWeekday }).map((_, idx) => (
                      <div key={`blank-${idx}`} className="h-11 sm:h-12 rounded-xl bg-gray-950/20 opacity-30" />
                    ))}

                    {/* Days of current month */}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const dayNumber = idx + 1;
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

                      const cellDate = new Date(year, month, dayNumber);
                      const dayOfWeek = cellDate.getDay(); // 0 = Dom, 6 = Sáb
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                      const todayNormalized = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const cellNormalized = new Date(year, month, dayNumber);
                      const diffMs = cellNormalized.getTime() - todayNormalized.getTime();
                      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

                      const isPast = diffDays < 0;
                      const isToday = diffDays === 0;

                      // The 3 business days following today are OCCUPIED:
                      const isOccupiedBusinessDay = occupiedBusinessDays.includes(dateStr);
                      const isUserBooked = userBookedDates.includes(dateStr);

                      // Available if NOT past, NOT today, NOT weekend, NOT occupied, NOT user booked
                      // NO RECURRING 3-DAY OCCUPIED PATTERN!
                      const isAvailable = !isPast && !isToday && !isWeekend && !isOccupiedBusinessDay && !isUserBooked;
                      const isSelected = selectedDate === dateStr;

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`h-11 sm:h-12 rounded-xl text-center relative flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 text-white font-black shadow-md ring-2 ring-indigo-400 scale-[1.02] cursor-pointer'
                              : isAvailable
                              ? 'bg-emerald-950/25 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/40 hover:border-emerald-400 font-bold cursor-pointer'
                              : isOccupiedBusinessDay || isUserBooked
                              ? 'bg-rose-950/30 border border-rose-900/40 text-rose-300 cursor-not-allowed opacity-85'
                              : isToday
                              ? 'bg-indigo-950/30 border border-indigo-700/40 text-indigo-300 cursor-not-allowed opacity-75'
                              : isWeekend
                              ? 'bg-gray-950/40 border border-gray-800/40 text-gray-500 cursor-not-allowed opacity-50'
                              : 'bg-gray-950/30 text-gray-600 cursor-not-allowed opacity-40'
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-display leading-none">{dayNumber}</span>
                          <span className="text-[8px] uppercase tracking-tighter mt-0.5 leading-none">
                            {isSelected ? (
                              <span className="text-white font-extrabold">Escolhido</span>
                            ) : isOccupiedBusinessDay || isUserBooked ? (
                              <span className="text-rose-400 font-bold">Ocupado</span>
                            ) : isToday ? (
                              <span className="text-indigo-300 font-semibold">Hoje</span>
                            ) : isWeekend ? (
                              <span className="text-gray-500">Fim de sem.</span>
                            ) : isPast ? (
                              <span className="text-gray-600">Passado</span>
                            ) : isAvailable ? (
                              <span className="text-emerald-400 font-medium">Livre</span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Clean Legend */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-gray-800/80 text-[10px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Disponível (Livre para Agendamento)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Ocupado (3 dias úteis seguintes)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-600" />
                      <span>Fim de Semana / Passado</span>
                    </div>
                  </div>
                </div>

                {/* Time Slots for Selected Day */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 font-display flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      Horário Disponível para {selectedDate}
                    </span>
                    <span className="text-[10px] text-gray-400 normal-case font-normal">(Lisboa / WET)</span>
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {timeSlots.map((slot) => {
                      const isSlotSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-1.5 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSlotSelected
                              ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-400'
                              : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Informações do Pedido (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5 bg-gray-900/40 border border-gray-800 rounded-2xl p-4">
                <div className="space-y-3.5">
                  {/* Nickname da Conta */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1 font-display flex items-center gap-1">
                      <User className="w-3 h-3 text-purple-400" />
                      Nickname da Conta
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pedro_Brawler / Ana3D"
                      value={accountNickname}
                      onChange={(e) => setAccountNickname(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* E-mail de Contacto */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1 font-display flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-400" />
                      E-mail de Notificação
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="teu.email@exemplo.com"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Tipo de Reunião & Razão (Parcerias em Projetos) */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1 font-display flex items-center gap-1">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      Tipo de Reunião
                    </label>
                    <div className="space-y-1.5">
                      {meetingTypes.map((type) => {
                        const isSelected = selectedTypeId === type.id;
                        return (
                          <div
                            key={type.id}
                            onClick={() => setSelectedTypeId(type.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500/40'
                                : 'bg-gray-950/60 border-gray-800/80 hover:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white">{type.name}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                                {type.duration} min
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                              {type.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Editable Meeting Time */}
                  <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider font-display flex items-center gap-1">
                        <Edit3 className="w-3 h-3 text-indigo-400" />
                        Duração Editável ({activeMeeting.name})
                      </label>
                      <span className="text-xs font-black text-white font-mono">
                        {activeMeeting.duration} min
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="5"
                        value={activeMeeting.duration}
                        onChange={(e) => handleUpdateDuration(parseInt(e.target.value, 10))}
                        className="flex-1 accent-indigo-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="5"
                          max="180"
                          value={activeMeeting.duration}
                          onChange={(e) => handleUpdateDuration(parseInt(e.target.value, 10))}
                          className="w-14 bg-gray-950 border border-indigo-500/50 rounded-lg px-2 py-1 text-xs text-center font-mono font-bold text-white focus:outline-none"
                        />
                        <span className="text-[10px] text-gray-400">min</span>
                      </div>
                    </div>
                    <div className="flex gap-1 text-[10px]">
                      {[15, 30, 45, 60].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleUpdateDuration(preset)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                            activeMeeting.duration === preset
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {preset}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Razão / Motivo da Reunião */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1 font-display">
                      Razão da Reunião
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dúvidas sobre modelação ou proposta de parceria"
                      value={meetingReason}
                      onChange={(e) => setMeetingReason(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-indigo-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all font-display flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Marcar para {selectedDate} ({selectedSlot})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-gray-400 text-center mt-1.5">
                    Sincroniza com Cal.com (@{CAL_USERNAME}) e notifica {OUTLOOK_EMAIL}
                  </p>
                </div>
              </div>
            </form>
          ) : (
            /* Booking Confirmation View */
            <div className="p-6 rounded-2xl bg-gray-900/90 border border-emerald-500/30 text-center space-y-4 animate-fade-in max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider font-display">
                  Reunião Agendada com Sucesso
                </span>
                <h3 className="text-lg font-black text-white font-display mt-0.5">
                  Confirmado no Calendário Cal.com
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Referência de reserva:{' '}
                  <span className="font-mono text-indigo-300 font-bold">{bookingRef}</span>
                </p>
              </div>

              {/* Clean Summary Card */}
              <div className="bg-black/50 border border-gray-800 rounded-xl p-3.5 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">Data &amp; Hora:</span>
                  <span className="font-bold text-white">
                    {selectedDate} às {selectedSlot} ({activeMeeting.duration} min)
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">Nickname Solicitante:</span>
                  <span className="font-bold text-white">{accountNickname}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">Razão da Reunião:</span>
                  <span className="font-bold text-indigo-300">{meetingReason || activeMeeting.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">Anfitrião Cal.com:</span>
                  <span className="font-medium text-purple-300">
                    {CAL_USERNAME} ({OUTLOOK_EMAIL})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">E-mail Notificado:</span>
                  <span className="font-medium text-gray-300">{attendeeEmail}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer font-display"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descarregar Convite (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBooked(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer font-display"
                >
                  <span>Agendar Outra Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
