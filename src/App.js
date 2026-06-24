import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import MapView from './pages/MapView'
import Calendar from './pages/Calendar'
import PlanList from './pages/PlanList'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/plans" element={<PlanList />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
