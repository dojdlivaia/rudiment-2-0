import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Brain, BarChart3, Home, Menu, X, Zap } from 'lucide-react';
import HomePage from './pages/Home';
import TestsPage from './pages/Tests';
import ProfilePage from './pages/Profile';
import ProgressPage from './pages/Progress';
import AnchorTest from './tests/AnchorTest';
import ConfirmationTest from './tests/ConfirmationTest';
import HindsightTest from './tests/HindsightTest';
import CalibrationTest from './tests/CalibrationTest';
import StatisticalTest from './tests/StatisticalTest';
import IllusionTest from './tests/IllusionTest';
import TowerTest from './tests/TowerTest';
import { loadProfile, UserProfile } from './store';

function App() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Главная', icon: Home },
    { path: '/tests', label: 'Тесты', icon: Brain },
    { path: '/profile', label: 'Профиль', icon: BarChart3 },
    { path: '/progress', label: 'Прогресс', icon: Zap },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-raptor-500 to-raptor-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="font-bold text-lg text-stone-800">Рудимент 2.0</span>
          </Link>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-raptor-100 text-raptor-800'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-stone-200 bg-white/95 backdrop-blur-md">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 text-sm font-medium border-b border-stone-100 ${
                  location.pathname === item.path
                    ? 'bg-raptor-50 text-raptor-800'
                    : 'text-stone-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage profile={profile} />} />
          <Route path="/tests" element={<TestsPage profile={profile} setProfile={setProfile} />} />
          <Route path="/profile" element={<ProfilePage profile={profile} />} />
          <Route path="/progress" element={<ProgressPage profile={profile} />} />
          <Route path="/test/anchoring" element={<AnchorTest profile={profile} setProfile={setProfile} />} />
          <Route path="/test/confirmation" element={<ConfirmationTest profile={profile} setProfile={setProfile} />} />
          <Route path="/test/hindsight" element={<HindsightTest profile={profile} setProfile={setProfile} />} />
          <Route path="/test/calibration" element={<CalibrationTest profile={profile} setProfile={setProfile} />} />
          <Route path="/test/statistical" element={<StatisticalTest profile={profile} setProfile={setProfile} />} />
          <Route path="/test/illusion" element={<IllusionTest profile={profile} setProfile={setProfile} />} />
          <Route path="/test/planning" element={<TowerTest profile={profile} setProfile={setProfile} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/50 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-stone-500">
          <p>Рудимент 2.0 — твой внутренний велоцираптор реагирует быстрее, чем кора 🦖</p>
          <p className="mt-1">Мы все попадаемся. Вот как это работает.</p>
        </div>
      </footer>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
