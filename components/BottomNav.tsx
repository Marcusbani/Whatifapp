'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, BookOpen, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/browse', icon: Heart, label: 'Connections' },
    { href: '/stories', icon: BookOpen, label: 'Stories' },
    { href: '/messages', icon: MessageCircle, label: 'Messages' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-wf-gray/95 backdrop-blur-md border-t border-wf-gray-light md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 ${isActive ? 'text-wf-gold' : 'text-gray-400'}`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
