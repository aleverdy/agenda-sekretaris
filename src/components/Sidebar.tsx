'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Settings, LogOut, LogIn } from 'lucide-react';
import styles from './Sidebar.module.css';
import { useRouter } from 'next/navigation';

export default function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Kalender Agenda', href: '/', icon: Calendar, public: true },
    { name: 'Direksi & Divisi', href: '/participants', icon: Users, public: true },
    { name: 'Pengaturan', href: '/settings', icon: Settings, public: false },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>A</div>
        <h2>AgendaPro</h2>
      </div>
      <nav className={styles.nav}>
        {navItems.filter(item => item.public || isAdmin).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {isAdmin ? (
            <button onClick={handleLogout} className={styles.navItem} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}>
              <LogOut size={20} />
              <span>Logout Admin</span>
            </button>
          ) : (
            <Link href="/login" className={styles.navItem}>
              <LogIn size={20} />
              <span>Login Admin</span>
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
}
