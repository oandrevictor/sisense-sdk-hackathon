import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { FaBed, FaClipboardUser, FaHouse, FaUsers } from 'react-icons/fa6';
import './App.css';
import Sidebar, { Page } from './components/Sidebar';

import DiagnosisPage from './pages/DiagnosisPage';
import DoctorsPage from './pages/DoctorsPage';
import Home from './pages/Home';
import PatientsPage from './pages/PatientsPage';

const pages: Page[] = [
  {
    label: 'Insights',
    icon: <FaHouse />,
    component: <Home />
  },
  {
    label: 'Diagnosis',
    icon: <FaClipboardUser />,
    component: <DiagnosisPage />
  },
  {
    label: 'Doctors',
    icon: <FaUsers />,
    component: <DoctorsPage />
  },
  {
    label: 'Patients',
    icon: <FaBed />,
    component: <PatientsPage />
  }
]

function App() {
  const [page, setPage] = useState(pages[0]);

  return (
    <div className="d-flex flex-column">
      <Sidebar pages={pages} active={page} onChange={page => setPage(page)} />

      <div className="page-content d-flex flex-column position-relative">
        <div className="color-background position-absolute" />
        <div className="mb-3"></div>

        {page.component}
      </div>
    </div>
  )
}

export default App
