'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddParticipantModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('DIREKSI');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, email, phone })
      });

      if (res.ok) {
        setIsOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        + Tambah Peserta
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ padding: '32px', width: '100%', maxWidth: '500px', background: 'rgba(15, 23, 42, 0.95)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Tambah Kontak Baru</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Nama Lengkap / Divisi</label>
                <input required type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Bapak Direktur" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Tipe / Peran (Bisa diisi manual)</label>
                <input 
                  list="type-options" 
                  className="input-field" 
                  value={type} 
                  onChange={e => setType(e.target.value)} 
                  placeholder="Contoh: Klien, Eksternal, dll" 
                />
                <datalist id="type-options">
                  <option value="DIREKSI">Direksi</option>
                  <option value="DIVISI">Divisi</option>
                </datalist>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email (Untuk Notifikasi)</label>
                <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@perusahaan.com" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Nomor WhatsApp (Untuk Notifikasi)</label>
                <input type="tel" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="081234567890" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Kontak'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
