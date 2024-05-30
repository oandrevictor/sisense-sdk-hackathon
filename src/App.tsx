import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Charts from './pages/Charts';
import Sidebar, { Page } from './components/Sidebar';
import Home from './pages/Home';
import { useState } from 'react';
import { FaChartPie, FaHouse } from 'react-icons/fa6';

const pages: Page[] = [
  {
    label: 'Home',
    icon: <FaHouse />,
    component: <Home />
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
