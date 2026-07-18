'use client';

import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { id } from 'date-fns/locale';

const locales = {
  'id-ID': id,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type AgendaParticipant = {
  participant: {
    id: string;
    name: string;
  }
};

type Agenda = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  participants: AgendaParticipant[];
};

import { useState } from 'react';
import EventDetailModal from './EventDetailModal';

export default function CalendarView({ initialAgendas }: { initialAgendas: Agenda[] }) {
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);

  const events: Event[] = initialAgendas.map(agenda => ({
    title: agenda.title,
    start: new Date(agenda.startDate),
    end: new Date(agenda.endDate),
    resource: agenda,
  }));

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '16px', padding: '16px' }}
        culture="id-ID"
        onSelectEvent={(event) => setSelectedAgenda(event.resource as Agenda)}
        messages={{
          next: "Selanjutnya",
          previous: "Sebelumnya",
          today: "Hari Ini",
          month: "Bulan",
          week: "Minggu",
          day: "Hari",
          agenda: "Daftar Agenda"
        }}
      />
      {selectedAgenda && (
        <EventDetailModal 
          agenda={selectedAgenda} 
          onClose={() => setSelectedAgenda(null)} 
        />
      )}
    </>
  );
}
