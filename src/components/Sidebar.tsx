'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Settings, LogOut, LogIn, Menu, X } from 'lucide-react';
import styles from './Sidebar.module.css';
import { useRouter } from 'next/navigation';

export default function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Kalender Agenda', href: '/', icon: Calendar, public: true },
    { name: 'Direksi & Divisi', href: '/participants', icon: Users, public: true },
    { name: 'Pengaturan', href: '/settings', icon: Settings, public: false },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className={styles.mobileHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className={styles.logoIcon} style={{ width: '32px', height: '32px', fontSize: '16px' }}>A</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>AgendaPro</h2>
        </div>
        <button className={styles.hamburger} onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {isOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>A</div>
          <h2>AgendaPro</h2>
          <button className={styles.hamburger} onClick={closeSidebar} style={{ marginLeft: 'auto', display: 'block' }}>
            <X size={24} />
          </button>
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
                onClick={closeSidebar}
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
              <Link href="/login" className={styles.navItem} onClick={closeSidebar}>
                <LogIn size={20} />
                <span>Login Admin</span>
              </Link>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
