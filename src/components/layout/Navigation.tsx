import { FloatingNav } from "@/components/ui/floating-navbar";
import {
  IconHome,
  IconMovie,
  IconUsers,
  IconSettings,
  IconChartBar,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const { signout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const navItems = [
    {
      name: "Beranda",
      link: "/dashboard",
      icon: <IconHome className="h-4 w-4" />,
      onClick: () => handleNavigation('/dashboard'),
    },
    {
      name: "Projects",
      link: "/projects",
      icon: <IconMovie className="h-4 w-4" />,
      onClick: () => handleNavigation('/projects'),
    },
    {
      name: "Team",
      link: "/team",
      icon: <IconUsers className="h-4 w-4" />,
      onClick: () => handleNavigation('/team'),
    },
    {
      name: "Profile",
      link: "/profile",
      icon: <IconUser className="h-4 w-4" />,
      onClick: () => handleNavigation('/profile'),
    },
    {
      name: "Analytics",
      link: "/analytics",
      icon: <IconChartBar className="h-4 w-4" />,
      onClick: () => handleNavigation('/analytics'),
    },
    {
      name: "Settings",
      link: "/settings",
      icon: <IconSettings className="h-4 w-4" />,
      onClick: () => handleNavigation('/settings'),
    },
    {
      name: "Keluar",
      link: "#",
      icon: <IconLogout className="h-4 w-4" />,
      onClick: handleLogout,
    },
    user?.role === 'admin' && {
      name: "User Management",
      link: "/admin",
      icon: <IconUsers className="h-4 w-4" />,
      onClick: () => handleNavigation('/admin'),
    },
  ].filter(Boolean);

  return <FloatingNav navItems={navItems} />;
};
