'use client';
import { Bell, Key, Moon, Palette, Shield, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [testPhone, setTestPhone] = useState('');
  const [testStatus, setTestStatus] = useState('');

  const [waTemplate, setWaTemplate] = useState('');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data.success && data.data['CHAT_TEMPLATE']) {
        setWaTemplate(data.data['CHAT_TEMPLATE']);
      } else {
        setWaTemplate('Halo [NAMA],\n\nIni adalah pesan pengingat untuk agenda Anda berikut ini:\n\n📌 *[JUDUL]*\n⏰ Waktu: [WAKTU]\n📍 Lokasi: [LOKASI]\n\nMohon persiapkan diri Anda. Terima kasih.\n\n_Pesan otomatis dari Sistem Agenda Sekretaris_');
      }
    });
  }, []);

  const handleSaveTemplate = async () => {
    setIsSavingTemplate(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'CHAT_TEMPLATE', value: waTemplate })
      });
      alert('Template berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan template');
    } finally {
      setIsSavingTemplate(false);
    }
  };

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
        
        {/* Template Section */}
        <section className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <MessageCircle size={24} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Template Pesan Pengingat</h2>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Anda bisa menggunakan kata kunci berikut yang akan otomatis diganti oleh sistem:<br/>
            <code>[NAMA]</code>, <code>[JUDUL]</code>, <code>[WAKTU]</code>, <code>[LOKASI]</code>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea 
              className="input-field"
              value={waTemplate}
              onChange={(e) => setWaTemplate(e.target.value)}
              rows={8}
              style={{ width: '100%', resize: 'vertical' }}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleSaveTemplate}
              disabled={isSavingTemplate}
              style={{ alignSelf: 'flex-end' }}
            >
              {isSavingTemplate ? 'Menyimpan...' : 'Simpan Template'}
            </button>
          </div>
        </section>

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
