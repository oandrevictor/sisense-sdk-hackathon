import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Charts from './pages/Charts';
import Sidebar, { Page } from './components/Sidebar';
import Home from './pages/Home';
import { useState } from 'react';

const pages: Page[] = [
  {
    label: 'Home',
    component: <Home />
  },
  {
    label: 'Charts',
    component: <Charts />
  }
]

function App() {
  const [page, setPage] = useState(pages[0]);

  return (
    <div className="layout d-flex">
      <Sidebar pages={pages} active={page} onChange={page => setPage(page)} />

      <div className="page-content">
        {page.component}
      </div>
    </div>
  )
}

export default App
