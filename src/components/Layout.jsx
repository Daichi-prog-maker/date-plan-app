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
    <div style={{ minHeight: '100vh' }}>
      {children}
      
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'linear-gradient(to top, #8B7355 0%, #A88B6B 100%)',
        display: 'flex', 
        borderTop: '3px solid #6B5744',
        boxShadow: '0 -4px 12px rgba(75, 63, 53, 0.3)',
        zIndex: 50 
      }}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '0.75rem 0.5rem', 
                textDecoration: 'none', 
                backgroundColor: isActive ? '#6B5744' : 'transparent',
                color: isActive ? '#F5F1E8' : '#E8DCC8',
                transition: 'all 0.2s',
                borderRadius: isActive ? '12px 12px 0 0' : '0'
              }}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ 
                fontSize: '0.75rem', 
                marginTop: '0.25rem',
                fontWeight: isActive ? '600' : '400'
              }}>{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
