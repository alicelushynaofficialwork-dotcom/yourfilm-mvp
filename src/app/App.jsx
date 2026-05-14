import HomePage from '../pages/HomePage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import WatchlistPage from '../pages/WatchlistPage.jsx';

export default function App() {
  if (window.location.pathname === '/profile') {
    return <ProfilePage />;
  }

  if (window.location.pathname === '/watchlist') {
    return <WatchlistPage />;
  }

  return <HomePage />;
}
