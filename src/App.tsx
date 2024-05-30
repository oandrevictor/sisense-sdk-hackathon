import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { FaChartPie, FaClipboardUser, FaHouse, FaUsers } from 'react-icons/fa6';
import './App.css';
import Sidebar, { Page } from './components/Sidebar';
import Charts from './pages/Charts';
import DiagnosisPage from './pages/DiagnosisPage';
import DoctorsPage from './pages/DoctorsPage';
import Home from './pages/Home';

const pages: Page[] = [
  {
    label: 'Home',
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
    label: 'Insights',
    icon: <FaChartPie />,
    component: <Charts />
  }
]

function App() {
  const [page, setPage] = useState(pages[0]);

  return (
    <div className="layout d-flex">
      <Sidebar pages={pages} active={page} onChange={page => setPage(page)} />

      <div className="page-content px-4 py-5 d-flex flex-column position-relative">
        <div className="color-background position-absolute" />
        <div className="mb-4 text-black-50"><span className="body-xs">/</span> {page.label}</div>

        {page.component}
      </div>
    </div>
  )
}

export default App
