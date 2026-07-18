'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Sandi salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Lock size={32} />
        </div>
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Login Admin</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center', fontSize: '14px' }}>
          Masukkan sandi rahasia untuk mengelola agenda dan partisipan.
        </p>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <input 
              type="password" 
              placeholder="Masukkan Sandi" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '12px 16px', fontSize: '16px', textAlign: 'center', letterSpacing: '2px' }}
            />
          </div>
          
          {error && <p style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p>}
          
          <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
