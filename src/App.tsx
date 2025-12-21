import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import LandingPage from "./pages/LandingPage"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
