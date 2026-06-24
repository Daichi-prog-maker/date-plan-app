import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Map, Calendar, List } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Heart, label: 'ホーム' },
    { path: '/map', icon: Map, label: 'マップ' },
    { path: '/calendar', icon: Calendar, label: 'カレンダー' },
    { path: '/plans', icon: List, label: 'プラン' }
  ]
  
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-primary text-primary-content sticky top-0 z-50 shadow-lg">
        <div className="flex-1">
          <h1 className="text-xl font-bold px-4">○○に行きたいんじゃ！</h1>
        </div>
      </div>
      
      <main className="container mx-auto p-4 pb-20">
        {children}
      </main>
      
      <div className="btm-nav btm-nav-lg bg-base-100 border-t">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={location.pathname === path ? 'active bg-primary text-primary-content' : ''}
          >
            <Icon size={24} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
