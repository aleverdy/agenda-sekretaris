import { PrismaClient } from '@prisma/client';
import CalendarView from '@/components/CalendarView';
import AddAgendaModal from '@/components/AddAgendaModal';

const prisma = new PrismaClient();

export default async function Home() {
  const agendas = await prisma.agenda.findMany({
    include: {
      participants: {
        include: {
          participant: true
        }
      }
    }
  });

  const participants = await prisma.participant.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Dashboard Agenda</h1>
          <p style={{ color: 'var(--text-muted)' }}>Pantau seluruh jadwal Direksi dan Divisi</p>
        </div>
        <AddAgendaModal participants={participants} />
      </div>

      <div style={{ height: '700px' }}>
        <CalendarView initialAgendas={agendas} />
      </div>
    </div>
  );
}
