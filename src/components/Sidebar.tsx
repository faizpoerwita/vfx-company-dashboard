import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FilmIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/projects', icon: FilmIcon, label: 'Projects' },
    { path: '/resources', icon: UserGroupIcon, label: 'Resources' },
    { path: '/tasks', icon: ClipboardDocumentListIcon, label: 'Tasks' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <div className="text-xl font-bold mb-8 p-2">VFX Dashboard</div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="h-6 w-6 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
