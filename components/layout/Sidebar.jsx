'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG, NAV_ITEMS } from '@/constants/site';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link href="/" className="brand-logo">
          <span className="brand-name">{SITE_CONFIG.name}</span>
          <span className="brand-title">{SITE_CONFIG.role}</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link ${isActive ? 'is-active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <a href={SITE_CONFIG.cvUrl} target="_blank" rel="noreferrer" className="cv-download-link">
          Download CV
        </a>
        <div className="sidebar-socials">
          <a href={SITE_CONFIG.socials.linkedin} target="_blank" rel="noreferrer">LN</a>
          <span>·</span>
          <a href={SITE_CONFIG.socials.behance} target="_blank" rel="noreferrer">BE</a>
          <span>·</span>
          <a href={SITE_CONFIG.socials.instagram} target="_blank" rel="noreferrer">IG</a>
        </div>
      </div>
    </aside>
  );
}
