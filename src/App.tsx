import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreateForm from './pages/CreateForm'
import PreviewForm from './pages/PreviewForm'
import MyForms from './pages/MyForms'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<MyForms />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          
        </Routes>
      </Router>
    </div>
  )
}

export default App