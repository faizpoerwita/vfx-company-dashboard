import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconSearch, IconFilter, IconRefresh, IconEdit, IconTrash, IconCheck, IconX, 
  IconUsers, IconUserPlus, IconBriefcase, IconAward, IconChartBar, IconSettings,
  IconAlertTriangle, IconActivity, IconMail, IconPhone, IconCalendar
} from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { AdminButton } from '@/components/ui/admin-button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import Analytics from '@/components/admin/Analytics';
import { useAuth } from '@/contexts/AuthContext';
import { Modal } from "@/components/ui/modal";
import { api } from '@/utils/api';
import { Navigation } from '@/components/layout/Navigation';
import { MovingBorder } from "@/components/ui/moving-border";
import { SearchBar } from "@/components/ui/search-bar";
import { SpotlightButton } from "@/components/ui/spotlight-button";
import { StatsCard } from "@/components/ui/stats-card";
import { cn } from "@/utils/cn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Meteors } from "@/components/ui/meteors";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SparklesCore } from "@/components/ui/sparkles";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Dialog } from '@headlessui/react';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

interface User {
  _id: string;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const ROLES = ['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer', 'admin'];

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    mode: 'edit' | 'delete' | null;
    user: User | null;
  }>({
    isOpen: false,
    mode: null,
    user: null
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.admin.getUsers();
      
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to fetch users');
        toast.error(response.error || 'Failed to fetch users');
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await api.admin.updateUser(userId, updates);
      if (response.success) {
        toast.success('User updated successfully');
        fetchUsers();
        closeDialog();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await api.admin.deleteUser(userId);
      if (response.success) {
        toast.success('User deleted successfully');
        fetchUsers();
        closeDialog();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await api.admin.updateUser(userId, { status: newStatus });
      if (response.success) {
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleEdit = (user: User) => {
    setDialogState({
      isOpen: true,
      mode: 'edit',
      user: { ...user }
    });
  };

  const handleDelete = (userId: string) => {
    const userToDelete = users.find(u => u._id === userId);
    if (userToDelete) {
      setDialogState({
        isOpen: true,
        mode: 'delete',
        user: userToDelete
      });
    }
  };

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      mode: null,
      user: null
    });
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch = !searchTerm || 
      fullName.includes(searchTermLower) ||
      email.includes(searchTermLower);
    
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative">
      <Navigation />
      <TracingBeam className="px-6">
        <div className="container mx-auto space-y-8 relative">
          {/* Header Section */}
          <div className="flex flex-col space-y-4 pt-8">
            <div className="flex items-center justify-between">
              <MovingBorder className="cursor-default">
                <BackgroundGradient className="rounded-[22px] p-4 sm:p-10">
                  <h1 className="text-2xl font-bold text-neutral-100">Admin Dashboard</h1>
                </BackgroundGradient>
              </MovingBorder>
              <div className="flex gap-2 relative z-10">
                <AdminButton
                  onClick={() => console.log('Settings')}
                  size="md"
                >
                  <IconSettings className="h-4 w-4 mr-2" />
                  Settings
                </AdminButton>
                <AdminButton
                  onClick={fetchUsers}
                  size="md"
                >
                  <IconRefresh className="h-4 w-4 mr-2" />
                  Refresh
                </AdminButton>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Users"
              value={users.length.toString()}
              description="Active and inactive users"
              icon={<IconUsers className="h-6 w-6" />}
            />
            <StatsCard
              title="Active Users"
              value={users.filter(u => u.status === 'active').length.toString()}
              description="Currently active users"
              icon={<IconActivity className="h-6 w-6" />}
            />
            <StatsCard
              title="Admins"
              value={users.filter(u => u.role === 'admin').length.toString()}
              description="Users with admin privileges"
              icon={<IconAward className="h-6 w-6" />}
            />
            <StatsCard
              title="New Users"
              value={users.filter(u => {
                const createdDate = new Date(u.createdAt);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return createdDate > thirtyDaysAgo;
              }).length.toString()}
              description="Joined in last 30 days"
              icon={<IconUserPlus className="h-6 w-6" />}
            />
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/50 p-4 rounded-lg backdrop-blur-sm">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full md:w-96"
            />
            <div className="flex gap-2">
              <select
                className="bg-neutral-900/50 text-white rounded-lg px-4 py-2 border border-neutral-800"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <select
                className="bg-neutral-900/50 text-white rounded-lg px-4 py-2 border border-neutral-800"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
              <CardContainer key={user._id} className="bg-black/50 backdrop-blur-sm">
                <CardBody className="relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.1] w-full">
                  <CardItem className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {`${user.firstName || ''} ${user.lastName || ''}`}
                        </h3>
                        <p className="text-sm text-white/60">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 relative z-10">
                      <AdminButton
                        onClick={() => handleEdit(user)}
                        size="icon"
                      >
                        <IconEdit className="h-4 w-4" />
                      </AdminButton>
                      <AdminButton
                        onClick={() => handleDelete(user._id)}
                        variant="danger"
                        size="icon"
                      >
                        <IconTrash className="h-4 w-4" />
                      </AdminButton>
                    </div>
                  </CardItem>
                  <CardItem className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <IconBriefcase className="h-4 w-4 text-white/60" />
                      <span className="text-sm text-white/80">{user.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4 text-white/60" />
                      <span className="text-sm text-white/80">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                      <AdminButton
                        onClick={() => handleToggleStatus(user._id, user.status)}
                        size="sm"
                        variant={user.status === 'active' ? 'success' : 'default'}
                      >
                        {user.status === 'active' ? (
                          <IconCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <IconX className="h-3 w-3 mr-1" />
                        )}
                        {user.status}
                      </AdminButton>
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </TracingBeam>

      {/* Edit/Delete Modal */}
      <Dialog
        open={dialogState.isOpen}
        onClose={closeDialog}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-black shadow-2xl">
            <div className="absolute inset-0 bg-neutral-950/90 z-0" />
            <BackgroundBeams className="absolute inset-0 opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/30" />
            
            <div className="relative z-10 p-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={80}
                  className="w-full h-full"
                  particleColor="#FFFFFF"
                />
              </div>

              <div className="relative">
                <Dialog.Title className="text-3xl font-bold mb-8 text-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                    {dialogState.mode === 'edit' ? 'Edit User' : 'Delete User'}
                  </span>
                </Dialog.Title>

                {dialogState.mode === 'edit' && dialogState.user && (
                  <div className="flex flex-col items-center w-full">
                    <BackgroundGradient className="rounded-[22px] max-w-sm w-full p-[1px]">
                      <div className="rounded-[22px] p-5 sm:p-7 bg-neutral-950/90 space-y-5 backdrop-blur-xl">
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                          <input
                            type="text"
                            value={dialogState.user.firstName || ''}
                            onChange={(e) => setDialogState(prev => ({
                              ...prev,
                              user: { ...prev.user!, firstName: e.target.value }
                            }))}
                            placeholder="First Name"
                            className="relative peer w-full px-4 py-3 rounded-xl bg-neutral-950/80 border-2 border-neutral-800/50 text-neutral-100 placeholder-transparent focus:outline-none focus:border-neutral-600 transition-all duration-300 group-hover:border-neutral-700"
                          />
                          <label className="absolute left-4 -top-2.5 px-1 text-sm text-neutral-400 bg-neutral-950 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-neutral-300 peer-focus:bg-neutral-950">
                            First Name
                          </label>
                        </div>

                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                          <input
                            type="text"
                            value={dialogState.user.lastName || ''}
                            onChange={(e) => setDialogState(prev => ({
                              ...prev,
                              user: { ...prev.user!, lastName: e.target.value }
                            }))}
                            placeholder="Last Name"
                            className="relative peer w-full px-4 py-3 rounded-xl bg-neutral-950/80 border-2 border-neutral-800/50 text-neutral-100 placeholder-transparent focus:outline-none focus:border-neutral-600 transition-all duration-300 group-hover:border-neutral-700"
                          />
                          <label className="absolute left-4 -top-2.5 px-1 text-sm text-neutral-400 bg-neutral-950 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-neutral-300 peer-focus:bg-neutral-950">
                            Last Name
                          </label>
                        </div>

                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                          <input
                            type="email"
                            value={dialogState.user.email || ''}
                            onChange={(e) => setDialogState(prev => ({
                              ...prev,
                              user: { ...prev.user!, email: e.target.value }
                            }))}
                            placeholder="Email"
                            className="relative peer w-full px-4 py-3 rounded-xl bg-neutral-950/80 border-2 border-neutral-800/50 text-neutral-100 placeholder-transparent focus:outline-none focus:border-neutral-600 transition-all duration-300 group-hover:border-neutral-700"
                          />
                          <label className="absolute left-4 -top-2.5 px-1 text-sm text-neutral-400 bg-neutral-950 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-neutral-300 peer-focus:bg-neutral-950">
                            Email
                          </label>
                        </div>

                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                          <select
                            value={dialogState.user.role}
                            onChange={(e) => setDialogState(prev => ({
                              ...prev,
                              user: { ...prev.user!, role: e.target.value }
                            }))}
                            className="relative w-full px-4 py-3 rounded-xl bg-neutral-950/80 border-2 border-neutral-800/50 text-neutral-100 focus:outline-none focus:border-neutral-600 appearance-none cursor-pointer transition-all duration-300 group-hover:border-neutral-700"
                          >
                            {ROLES.map(role => (
                              <option key={role} value={role} className="bg-neutral-950 text-neutral-100">{role}</option>
                            ))}
                          </select>
                          <label className="absolute left-4 -top-2.5 px-1 text-sm text-neutral-400 bg-neutral-950">
                            Role
                          </label>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-neutral-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </BackgroundGradient>

                    <div className="flex justify-end gap-4 w-full max-w-sm mt-8">
                      <MovingBorder
                        duration={1500}
                        className="p-[1px] hover:p-[2px] transition-all duration-300"
                        borderRadius="1rem"
                      >
                        <button
                          onClick={closeDialog}
                          className="relative rounded-xl px-8 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:text-white bg-neutral-950 group"
                        >
                          <span className="relative z-10">Cancel</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </MovingBorder>
                      <MovingBorder
                        duration={1500}
                        className="p-[1px] hover:p-[2px] transition-all duration-300"
                        borderRadius="1rem"
                        containerClassName="bg-gradient-to-r from-emerald-900/50 to-emerald-700/50"
                      >
                        <button
                          onClick={() => handleUpdateUser(dialogState.user!._id, dialogState.user!)}
                          className="relative rounded-xl px-8 py-2.5 text-sm font-medium text-emerald-200 transition-colors hover:text-emerald-100 bg-neutral-950 group"
                        >
                          <span className="relative z-10">Save Changes</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </MovingBorder>
                    </div>
                  </div>
                )}

                {dialogState.mode === 'delete' && dialogState.user && (
                  <BackgroundGradient className="rounded-[22px] max-w-sm mx-auto p-[1px]">
                    <div className="rounded-[22px] p-6 sm:p-8 bg-neutral-950/90 backdrop-blur-xl">
                      <div className="space-y-2 text-center">
                        <p className="text-neutral-300 text-lg">
                          Are you sure you want to delete user
                        </p>
                        <p className="text-white font-semibold text-xl">
                          {dialogState.user.firstName} {dialogState.user.lastName}
                        </p>
                        <p className="text-neutral-400 text-sm mt-2">
                          This action cannot be undone.
                        </p>
                      </div>
                      <div className="flex justify-center gap-4 mt-8">
                        <MovingBorder
                          duration={1500}
                          className="p-[1px] hover:p-[2px] transition-all duration-300"
                          borderRadius="1rem"
                        >
                          <button
                            onClick={closeDialog}
                            className="relative rounded-xl px-8 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:text-white bg-neutral-950 group"
                          >
                            <span className="relative z-10">Cancel</span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </MovingBorder>
                        <MovingBorder
                          duration={1500}
                          className="p-[1px] hover:p-[2px] transition-all duration-300"
                          borderRadius="1rem"
                          containerClassName="bg-gradient-to-r from-red-900/50 to-red-700/50"
                        >
                          <button
                            onClick={() => handleDeleteUser(dialogState.user!._id)}
                            className="relative rounded-xl px-8 py-2.5 text-sm font-medium text-red-200 transition-colors hover:text-red-100 bg-neutral-950 group"
                          >
                            <span className="relative z-10">Delete User</span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-900 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </MovingBorder>
                      </div>
                    </div>
                  </BackgroundGradient>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Admin;
