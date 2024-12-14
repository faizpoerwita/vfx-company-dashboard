import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  HomeIcon,
  FolderIcon,
  UsersIcon,
  UserCircleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { BackgroundGradient } from '../ui/background-gradient';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link to={to} className="relative group">
      <div
        className={cn(
          "relative px-4 py-2.5 rounded-xl transition-all duration-300 ease-out",
          "hover:bg-neutral-900/50 hover:backdrop-blur-sm",
          isActive && "bg-neutral-900/50 backdrop-blur-sm"
        )}
      >
        <div className="absolute inset-0 rounded-xl transition-opacity group-hover:opacity-100 opacity-0">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="relative flex items-center gap-3">
          <div className={cn(
            "w-5 h-5 transition-colors duration-200",
            isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
          )}>
            {icon}
          </div>
          <span className={cn(
            "text-sm font-medium transition-colors duration-200",
            isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
          )}>
            {label}
          </span>
        </div>

        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-neutral-100 to-neutral-400 rounded-full" />
        )}
      </div>
    </Link>
  );
};

export const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: "/", icon: <HomeIcon />, label: "Beranda" },
    { to: "/projects", icon: <FolderIcon />, label: "Projects" },
    { to: "/team", icon: <UsersIcon />, label: "Team" },
    { to: "/profile", icon: <UserCircleIcon />, label: "Profile" },
    { to: "/analytics", icon: <ChartBarIcon />, label: "Analytics" },
    { to: "/settings", icon: <Cog6ToothIcon />, label: "Settings" },
    { to: "/admin", icon: <UserGroupIcon />, label: "User Management" },
  ];

  return (
    <BackgroundGradient className="fixed top-4 left-1/2 -translate-x-1/2 w-auto rounded-2xl p-[1px] z-50">
      <nav className="px-2 py-2 rounded-2xl bg-neutral-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.to}
            />
          ))}
          <div className="w-[1px] h-8 bg-neutral-800 mx-2" />
          <NavItem
            to="/logout"
            icon={<ArrowRightOnRectangleIcon />}
            label="Keluar"
            isActive={false}
          />
        </div>
      </nav>
    </BackgroundGradient>
  );
};
