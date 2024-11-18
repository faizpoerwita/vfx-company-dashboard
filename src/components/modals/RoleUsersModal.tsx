import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { IconX, IconUser, IconSearch, IconFilter } from '@tabler/icons-react';
import { BackgroundGradient } from '../ui/background-gradient';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  status?: 'active' | 'inactive';
}

interface RoleUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  users: User[];
  loading: boolean;
}

export function RoleUsersModal({ isOpen, onClose, role, users, loading }: RoleUsersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // Get unique departments
  const departments = [...new Set(users?.map(user => user.department).filter(Boolean))];

  // Filter users based on search and department
  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchQuery === '' || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || user.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center sm:p-4 p-2">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-neutral-950 shadow-xl transition-all">
                {/* Header */}
                <div className="relative border-b border-neutral-800">
                  <div className="px-6 py-4 sm:px-8 sm:py-6">
                    <div className="pr-8">
                      <Dialog.Title className="text-xl sm:text-2xl font-semibold text-neutral-200">
                        {role && role.charAt(0).toUpperCase() + role.slice(1)} Team Members
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-neutral-400">
                        View and manage team members in the {role} role
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="absolute right-4 top-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors"
                      aria-label="Close modal"
                    >
                      <IconX className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search and Filter Bar */}
                  <div className="px-6 py-3 sm:px-8 border-t border-neutral-800 bg-neutral-900/50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search Input */}
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IconSearch className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full rounded-lg border-0 bg-neutral-800/50 py-2 pl-10 pr-4 text-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                          placeholder="Search by name or email..."
                        />
                      </div>

                      {/* Department Filter */}
                      {departments.length > 0 && (
                        <div className="relative">
                          <select
                            value={selectedDepartment || ''}
                            onChange={(e) => setSelectedDepartment(e.target.value || null)}
                            className="block w-full rounded-lg border-0 bg-neutral-800/50 py-2 pl-4 pr-10 text-neutral-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <IconFilter className="h-5 w-5 text-neutral-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-8 py-6 max-h-[60vh] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-12"
                      >
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-200"></div>
                        <p className="mt-4 text-sm text-neutral-400">Loading team members...</p>
                      </motion.div>
                    ) : filteredUsers?.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {filteredUsers.map((user) => (
                          <motion.div
                            key={user._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <BackgroundGradient className="rounded-lg p-1 bg-black hover:scale-[1.02] transition-transform duration-200">
                              <div className="bg-neutral-950 rounded-lg p-4 sm:p-5">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <div className="flex items-baseline gap-2">
                                      <h3 className="text-base sm:text-lg font-semibold text-neutral-200 truncate">
                                        {user.firstName} {user.lastName}
                                      </h3>
                                      {user.status && (
                                        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                          user.status === 'active' 
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-red-500/10 text-red-400'
                                        }`}>
                                          {user.status}
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
                                      <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {user.department && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                          {user.department}
                                        </span>
                                      )}
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400">
                                        {user.role}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </BackgroundGradient>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <div className="mx-auto h-12 w-12 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4">
                          <IconUser className="w-6 h-6 text-neutral-400" />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-200">No Results Found</h3>
                        <p className="mt-1 text-sm text-neutral-400">
                          {searchQuery || selectedDepartment
                            ? 'Try adjusting your search or filter criteria'
                            : 'No team members found for this role'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 sm:px-8 sm:py-6 border-t border-neutral-800 bg-neutral-900/50">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-neutral-400">
                      {filteredUsers?.length} {filteredUsers?.length === 1 ? 'member' : 'members'} found
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
