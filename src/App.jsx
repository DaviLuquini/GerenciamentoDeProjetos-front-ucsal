import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Components/Login/Login';
import Register from './Components/Login/Register';
import DashboardAluno from './Dashboards/Aluno';
import DashboardProfessor from './Dashboards/Professor';
import DashboardAdmin from './Dashboards/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-aluno" element={<DashboardAluno />} />
        <Route path="/dashboard-professor" element={<DashboardProfessor />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      </Routes>
    </Router>
  );
}

export default App
