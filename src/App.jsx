import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PlanList from './pages/PlanList'
import AiSuggestions from './pages/AiSuggestions'

function App() {
  // スワイプでの戻る/進むを無効化
  useEffect(() => {
    const preventSwipeNavigation = (e) => {
      // 横方向のスワイプを検知
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        const x = touch.clientX
        const screenWidth = window.innerWidth
        
        // 画面端からのスワイプを防止
        if (x < 10 || x > screenWidth - 10) {
          e.preventDefault()
        }
      }
    }

    document.addEventListener('touchstart', preventSwipeNavigation, { passive: false })
    
    return () => {
      document.removeEventListener('touchstart', preventSwipeNavigation)
    }
  }, [])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<PlanList />} />
          <Route path="/ai-suggestions" element={<AiSuggestions />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
