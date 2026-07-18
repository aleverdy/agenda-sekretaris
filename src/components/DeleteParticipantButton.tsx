'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteParticipantButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Hapus kontak peserta ini secara permanen?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/participants/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert('Gagal menghapus peserta');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-muted)', padding: '4px',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      title="Hapus Peserta"
    >
      <Trash2 size={16} />
    </button>
  );
}
