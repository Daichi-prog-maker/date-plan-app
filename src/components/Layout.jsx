import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Sparkles, List } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Heart, label: 'ホーム' },
    { path: '/ai-suggestions', icon: Sparkles, label: 'AI提案' },
    { path: '/plans', icon: List, label: 'プラン' }
  ]
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fef3f9' }}>
      {children}
      
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', borderTop: '1px solid #e5e7eb', zIndex: 50 }}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 0.5rem', textDecoration: 'none', backgroundColor: isActive ? '#ec4899' : 'white', color: isActive ? 'white' : '#6b7280', transition: 'all 0.2s' }}
            >
              <Icon size={24} />
              <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
