import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { Navigation } from '@/components/layout/Navigation';
import { BackgroundBeams } from '@/components/ui/aceternity/background-beams';
import { Button } from '@/components/ui/aceternity/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
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
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await api.admin.deleteUser(userId);
      if (response.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await handleUpdateUser(userId, { status: newStatus });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="relative w-full overflow-hidden bg-gray-900/[0.96] antialiased">
        <BackgroundBeams className="absolute inset-0" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gray-900 p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative">
                <h1 className="text-2xl font-bold text-white mb-4">User Management</h1>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of all users in the system</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {editingUser === user._id ? (
                              <select
                                className="bg-gray-800 text-white rounded px-2 py-1"
                                defaultValue={user.role}
                                onChange={(e) => handleUpdateUser(user._id, { role: e.target.value })}
                              >
                                <option value="3D Artist">3D Artist</option>
                                <option value="Animator">Animator</option>
                                <option value="Compositor">Compositor</option>
                                <option value="VFX Supervisor">VFX Supervisor</option>
                                <option value="Producer">Producer</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              user.role
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleToggleStatus(user._id, user.status)}
                              className={`px-2 py-1 rounded ${
                                user.status === 'active'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {user.status === 'active' ? (
                                <CheckIcon className="h-4 w-4" />
                              ) : (
                                <XMarkIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => setEditingUser(editingUser === user._id ? null : user._id)}
                                className="p-1 hover:bg-gray-700 rounded"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-1 hover:bg-red-700 rounded"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
