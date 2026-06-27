import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AiSuggestions from './pages/AiSuggestions'
import PlanList from './pages/PlanList'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-suggestions" element={<AiSuggestions />} />
          <Route path="/plans" element={<PlanList />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
