'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG, NAV_ITEMS } from '@/constants/site';
import { Menu, X } from 'lucide-react';

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="mobile-header">
      <div className="mobile-header-bar">
        <Link href="/" className="mobile-brand">
          <span className="brand-name">{SITE_CONFIG.name}</span>
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav className="mobile-nav-dropdown">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`mobile-nav-link ${pathname === item.href ? 'is-active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={SITE_CONFIG.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="mobile-nav-link cv-link"
              >
                Download CV
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
