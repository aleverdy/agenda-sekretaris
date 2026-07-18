'use client';
import { Bell, Key, Moon, Palette, Shield, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [testPhone, setTestPhone] = useState('');
  const [testStatus, setTestStatus] = useState('');

  const handleTestWA = async () => {
    if (!testPhone) {
      setTestStatus('Silakan masukkan nomor WA');
      return;
    }
    setTestStatus('Mengirim...');
    try {
      const res = await fetch(`/api/test-wa?phone=${testPhone}`);
      const data = await res.json();
      if (data.success) {
        setTestStatus('✅ Berhasil terkirim!');
      } else {
        setTestStatus(`❌ Gagal: ${data.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      setTestStatus('❌ Gagal menghubungi server');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Pengaturan</h1>
        <p style={{ color: 'var(--text-muted)' }}>Atur preferensi sistem, notifikasi, dan integrasi API</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
        
        {/* Integrasi API Section */}
        <section className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Key size={24} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Integrasi API Layanan</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircle size={18} /> Uji Coba Pengiriman WA (Fonnte)
              </h3>
              <p style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                Pastikan Anda telah memasukkan FONNTE_TOKEN di Vercel Settings sebelum mencoba.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Contoh: 08123456789" 
                  className="input-field" 
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  style={{ flex: 1, maxWidth: '250px' }}
                />
                <button className="btn btn-primary" onClick={handleTestWA}>Kirim Pesan Tes</button>
              </div>
              {testStatus && <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: '500' }}>{testStatus}</p>}
            </div>
          </div>
        </section>

        {/* Preferensi Notifikasi Section */}
        <section className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Bell size={24} style={{ color: '#10b981' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Preferensi Notifikasi</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: '15px' }}>Kirim Pengingat Email secara Otomatis</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: '15px' }}>Kirim Pengingat WhatsApp secara Otomatis</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: '15px' }}>Notifikasi H-7 sebelum acara (Opsional)</span>
            </label>
            <button className="btn btn-secondary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>Perbarui Preferensi</button>
          </div>
        </section>

        {/* Tampilan Section */}
        <section className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Palette size={24} style={{ color: '#f59e0b' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Tampilan Aplikasi</h2>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn" style={{ background: '#0f172a', color: 'white', border: '1px solid #334155' }}>
              <Moon size={16} /> Mode Gelap
            </button>
            <button className="btn" style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1' }}>
              Mode Terang
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
