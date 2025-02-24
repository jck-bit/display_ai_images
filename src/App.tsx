import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { HomeIcon, HeartIcon } from 'lucide-react';
import LikedImagesPage from './pages/LikedImages';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageDataProvider } from './context/ImageData';

const App: React.FC = () => {
  return (
   <ImageDataProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/liked" element={<LikedImagesPage />} />
        </Routes>
      </Router>
    </ImageDataProvider>
  );
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isHover, setIsHover] = useState<string | null>(null);

  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/liked", label: "Liked", icon: HeartIcon },
  ];

  return (
    <nav className="bg-transparent py-4 px-6 flex justify-between items-center" style={{ fontFamily: 'Raleway', fontWeight: 600 }}>
      <span className="font-bold text-xl text-gray-800">
        Image Gallery
      </span>
      <ul className="flex items-center space-x-6">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            path={item.path}
            label={item.label}
            icon={item.icon}
            isActive={location.pathname === item.path}
            isHover={isHover === item.label}
            setIsHover={setIsHover}
          />
        ))}
      </ul>
    </nav>
  );
};


interface NavItemProps {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  isActive: boolean;
  isHover: boolean;
  setIsHover: React.Dispatch<React.SetStateAction<string | null>>;
}

const NavItem: React.FC<NavItemProps> = ({ path, label, icon: Icon, isActive, isHover, setIsHover }) => {
  return (
      <li
          className="relative"
          onMouseEnter={() => setIsHover(label)}
          onMouseLeave={() => setIsHover(null)}
      >
          <Link
              to={path}
              className={`py-2 relative duration-300 transition-colors hover:!text-gray-800 flex items-center space-x-2 ${isActive ? '!text-gray-800' : 'text-gray-600'}`}
              style={{ color: isActive ? "#374151" : "#6B7280" }}
              aria-label={`Go to ${label} page`}
          >
              <span className={isActive ? "text-gray-800" : "text-gray-600"}>
                <Icon size={20} />
              </span>
              <span className="hidden sm:inline-block">{label}</span>
              <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800 origin-bottom-left"
                  style={{
                      zIndex: -1,
                      borderRadius: '99px',
                  }}
                  layoutId="underline"
                  initial={false}
                  animate={{
                      scaleX: (isActive || isHover) ? 1 : 0,
                  }}
                  transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      duration: 0.2,
                  }}
              />
          </Link>
      </li>
  );
};

export default App;