'use client';
import { X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
type ParticipantType = {
  participant: {
    id: string;
    name: string;
  }
};

type AgendaProp = {
  id: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  location?: string | null;
  participants: ParticipantType[];
};

export default function EventDetailModal({ 
  agenda, 
  onClose,
  isAdmin
}: { 
  agenda: AgendaProp, 
  onClose: () => void,
  isAdmin?: boolean
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendReminder = async () => {
    if (!confirm('Kirim pesan pengingat ke semua partisipan sekarang?')) return;
    
    setIsSending(true);
    try {
      const res = await fetch(`/api/agendas/${agenda.id}/remind`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ ' + data.message);
      } else {
        alert('❌ Gagal: ' + data.error);
      }
    } catch (err) {
      alert('❌ Terjadi kesalahan jaringan');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus agenda ini secara permanen?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/agendas/${agenda.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        alert('Gagal menghapus agenda');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="glass-panel modal-content" style={{ padding: '24px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>
        
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', paddingRight: '24px' }}>{agenda.title}</h2>
        
        <div style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
          <p><strong>Mulai:</strong> {new Date(agenda.startDate).toLocaleString('id-ID')}</p>
          <p><strong>Selesai:</strong> {new Date(agenda.endDate).toLocaleString('id-ID')}</p>
          {agenda.location && <p><strong>Lokasi:</strong> {agenda.location}</p>}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Partisipan:</h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
            {agenda.participants?.map((ap) => (
              <li key={ap.participant.id}>{ap.participant.name}</li>
            ))}
          </ul>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={handleSendReminder}
              disabled={isSending}
              className="btn btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              {isSending ? 'Mengirim...' : 'Kirim Pengingat Sekarang'}
            </button>

            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn"
              style={{ width: '100%', background: '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', gap: '8px', border: 'none' }}
            >
              <Trash2 size={18} />
              {isDeleting ? 'Menghapus...' : 'Hapus Agenda Ini'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
