import { BottomNav } from './components/BottomNav.jsx';
import { MobileHeader } from './components/MobileHeader.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { ChangePage } from './pages/ChangePage.jsx';
import { ContractPage } from './pages/ContractPage.jsx';
import { IncidentPage } from './pages/IncidentPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { RoomPage } from './pages/RoomPage.jsx';
import './mobile.css';

const pages = {
  rooms: { title: '机房', component: RoomPage },
  contracts: { title: '合同', component: ContractPage },
  incidents: { title: '故障', component: IncidentPage },
  changes: { title: '割接', component: ChangePage },
  profile: { title: '我的', component: ProfilePage }
};

function getActivePage() {
  const segment = window.location.pathname.split('/').filter(Boolean)[1];
  return pages[segment] ? segment : 'rooms';
}

export default function MobileApp() {
  const activePage = getActivePage();
  const Page = pages[activePage].component;

  return (
    <main className="mobile-shell">
      <MobileHeader title={pages[activePage].title} />
      <section className="mobile-content">
        <SearchBar placeholder={`搜索${pages[activePage].title}信息`} />
        <Page />
      </section>
      <BottomNav activePage={activePage} />
    </main>
  );
}
