import { PrismaClient } from '@prisma/client';
import { Mail, Phone, Building, User } from 'lucide-react';
import AddParticipantModal from '@/components/AddParticipantModal';

const prisma = new PrismaClient();

export default async function ParticipantsPage() {
  const participants = await prisma.participant.findMany({
    orderBy: [
      { type: 'asc' },
      { name: 'asc' }
    ]
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Direksi & Divisi</h1>
          <p style={{ color: 'var(--text-muted)' }}>Kelola data kontak peserta agenda</p>
        </div>
        <AddParticipantModal />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {participants.map((p) => (
          <div key={p.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: p.type === 'DIREKSI' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: p.type === 'DIREKSI' ? 'var(--primary)' : '#10b981',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {p.type === 'DIREKSI' ? <User size={20} /> : <Building size={20} />}
              </div>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '16px' }}>{p.name}</h3>
                <span style={{ 
                  fontSize: '12px', padding: '2px 8px', borderRadius: '12px',
                  background: p.type === 'DIREKSI' ? 'var(--primary)' : '#10b981',
                  color: 'white', fontWeight: '500'
                }}>
                  {p.type}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              {p.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                  <span>{p.email}</span>
                </div>
              )}
              {p.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <Phone size={16} />
                  <span>{p.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
