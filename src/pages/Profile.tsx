import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { ROLES, RoleType } from '@/constants/roles';
import { Navigation } from '@/components/layout/Navigation';
import { BackgroundBeams } from '@/components/ui/aceternity/background-beams';
import { HoverEffect } from '@/components/ui/aceternity/hover-effect';
import { CardBody } from '@/components/ui/aceternity/card-body';
import { Button } from '@/components/ui/aceternity/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check } from 'lucide-react';
import {
  UserCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

import { WORK_PREFERENCES, transformPreferencesForBackend, transformPreferencesForFrontend, dislikedWorkAreas } from '@/constants/preferences';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface WorkPreference {
  name: string;
  value: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  skills: Skill[];
  workPreferences: WorkPreference[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  portfolio: string;
  bio: string;
  onboardingCompleted: boolean;
  dislikes: string[];
  role: string;
}

// Initial form data
const initialFormData: ProfileFormData = {
  firstName: '',
  lastName: '',
  email: '',
  skills: [],
  workPreferences: [],
  experienceLevel: 'Beginner',
  portfolio: '',
  bio: '',
  onboardingCompleted: false,
  dislikes: [],
  role: ''
};

const profileSchema = z.object({
  firstName: z.string().min(2, 'Nama depan minimal 2 karakter'),
  lastName: z.string().min(2, 'Nama belakang minimal 2 karakter'),
  skills: z.array(z.object({
    name: z.string(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
  })),
  workPreferences: z.array(z.object({
    name: z.string(),
    value: z.string()
  })),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  portfolio: z.string().url().optional(),
  bio: z.string().max(500, 'Bio maksimal 500 karakter'),
});

const skillCategories: Record<RoleType, string[]> = {
  [ROLES.THREE_D_ARTIST]: [
    'Modeling', 'Texturing', 'UV Mapping', 'Lighting', 'Rendering',
    'Sculpting', 'Rigging', 'Substance Designer', 'ZBrush', 'Maya', 'Blender'
  ],
  [ROLES.ANIMATOR]: [
    'Character Animation', 'Facial Animation', 'Motion Capture',
    'Rigging', 'Maya', 'Blender', 'Motion Graphics'
  ],
  [ROLES.COMPOSITOR]: [
    'Nuke', 'After Effects', 'Fusion', 'Rotoscoping', 'Keying',
    'Color Correction', 'Particle Systems'
  ],
  [ROLES.VFX_SUPERVISOR]: [
    'Creative Direction', 'Team Management', 'Client Communication',
    'Art Direction', 'Concept Development', 'Visual Development'
  ],
  [ROLES.PRODUCER]: [
    'Project Management', 'Budget Management', 'Team Coordination',
    'Client Relations', 'Resource Planning', 'Risk Management',
    'Scheduling', 'Quality Control', 'Stakeholder Management'
  ],
};

const experienceLevels = [
  { value: 'Beginner', label: 'Junior (0-2 tahun)' },
  { value: 'Intermediate', label: 'Intermediate (2-5 tahun)' },
  { value: 'Advanced', label: 'Senior (5+ tahun)' }
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        skills: Array.isArray(user.skills) ? user.skills.map(skill => 
          typeof skill === 'string' ? { name: skill, level: 'Beginner' } : skill
        ) : [],
        workPreferences: transformPreferencesForFrontend(user.workPreferences || []),
        experienceLevel: user?.experienceLevel || 'Beginner',
        portfolio: user?.portfolio || '',
        bio: user?.bio || '',
        onboardingCompleted: user?.onboardingCompleted || false,
        dislikes: user?.dislikes || [],
        role: user?.role || ''
      });
    }
  }, [user]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.auth.getProfile();
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch profile');
      }

      const data = response.data;
      console.log('Raw profile data:', data);

      // Convert skills array if needed
      const formattedSkills = Array.isArray(data.skills) 
        ? data.skills.map(skill => typeof skill === 'string' ? { name: skill, level: 'Beginner' } : skill)
        : [];

      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        skills: formattedSkills,
        workPreferences: Array.isArray(data.workPreferences) ? data.workPreferences : [],
        experienceLevel: data.experienceLevel || 'Beginner',
        portfolio: data.portfolio || '',
        bio: data.bio || '',
        onboardingCompleted: data.onboardingCompleted || false,
        dislikes: Array.isArray(data.dislikes) ? data.dislikes : [],
        role: data.role || ''
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);

      // Transform data to match backend schema with null checks
      const updateData = {
        firstName: formData.firstName?.trim() || '',
        lastName: formData.lastName?.trim() || '',
        bio: formData.bio?.trim() || '',
        experienceLevel: formData.experienceLevel || 'Beginner',
        portfolio: formData.portfolio?.trim() || '',
        skills: (formData.skills || [])
          .filter(skill => skill && skill.name && skill.name.trim() !== '')
          .map(skill => ({
            name: skill.name.trim(),
            level: skill.level || 'Beginner'
          })),
        workPreferences: (formData.workPreferences || [])
          .filter(pref => pref && pref.name && pref.name.trim() !== '')
          .map(pref => ({
            name: pref.name.trim(),
            value: (pref.value || '').trim()
          })),
        onboardingCompleted: Boolean(formData.onboardingCompleted)
      };

      console.log('Sending profile update:', updateData);
      const response = await api.auth.updateProfile(updateData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully');
      
      // Update user context if needed
      if (updateProfile) {
        await updateProfile(updateData);
      }

      // Refetch profile data and redirect
      await fetchProfileData();
      setIsEditing(false);
      navigate('/profile', { replace: true });
      
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = {
        ...newSkills[index],
        [field]: value
      };
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Beginner' }]
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
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
            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gray-900 p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <p className="mt-1 text-sm text-gray-400">
                    {formData.email}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {formData.bio || 'No bio added yet'}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Role: {formData.role || 'Not specified'}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfileData(); // Reset to original data
                        }}
                        className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700"
                      >
                        <span>Cancel</span>
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Personal Information */}
              <div className="space-y-8">
                <CardBody className="relative overflow-hidden rounded-xl border border-slate-800 bg-gray-900 p-8">
                  <h2 className="mb-4 text-xl font-semibold text-white">Personal Information</h2>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-400">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-800 bg-gray-900/50 p-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-slate-400">{formData.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-400">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-800 bg-gray-900/50 p-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-slate-400">{formData.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        URL Portfolio (opsional)
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-800 bg-gray-900/50 p-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          placeholder="https://yourportfolio.com"
                        />
                      ) : (
                        <p className="text-slate-400">
                          {formData.portfolio ? (
                            <a href={formData.portfolio} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                              {formData.portfolio}
                            </a>
                          ) : (
                            'No portfolio URL added yet.'
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Bio Singkat
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full rounded-lg border border-slate-800 bg-gray-900/50 p-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          placeholder="Ceritakan sedikit tentang diri Anda..."
                        />
                      ) : (
                        <p className="text-slate-400">{formData.bio || 'No bio added yet'}</p>
                      )}
                    </div>
                  </div>
                </CardBody>

                <CardBody className="relative overflow-hidden rounded-xl border border-slate-800 bg-gray-900 p-8">
                  <h2 className="mb-4 text-xl font-semibold text-white">Experience</h2>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-400">
                      Level Pengalaman
                    </label>
                    {isEditing ? (
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-slate-800 bg-gray-900/50 p-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Pilih level pengalaman</option>
                        {experienceLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-slate-400">
                        {experienceLevels.find(level => level.value === formData.experienceLevel)?.label || 'Belum memilih level pengalaman'}
                      </p>
                    )}
                  </div>
                </CardBody>
              </div>

              {/* Skills & Preferences */}
              <div className="space-y-8">
                <CardBody className="relative overflow-hidden rounded-xl border border-slate-800 bg-gray-900 p-8">
                  <h2 className="mb-4 text-xl font-semibold text-white">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      Object.entries(skillCategories).map(([category, skills]) => (
                        <div key={category} className="w-full space-y-2">
                          <h3 className="text-lg font-medium text-slate-300">{category}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {skills.map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => {
                                  const newSkills = [...formData.skills];
                                  const existingSkill = newSkills.find(s => s.name === skill);
                                  if (existingSkill) {
                                    newSkills.splice(newSkills.indexOf(existingSkill), 1);
                                  } else {
                                    newSkills.push({ name: skill, level: 'Beginner' });
                                  }
                                  setFormData({ ...formData, skills: newSkills });
                                }}
                                className={`px-4 py-2 rounded-lg border transition-colors ${
                                  formData.skills.find(s => s.name === skill)
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                                } hover:bg-neutral-800`}
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formData.skills.map((skill) => (
                          <div
                            key={skill.name}
                            className="px-4 py-2 rounded-lg border bg-blue-500/20 border-blue-500 text-blue-400"
                          >
                            {skill.name} ({skill.level})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardBody>

                <CardBody className="relative overflow-hidden rounded-xl border border-slate-800 bg-gray-900 p-8">
                  <h2 className="mb-4 text-xl font-semibold text-white">Work Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isEditing ? (
                      WORK_PREFERENCES.map((pref) => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => {
                            const newPreferences = [...formData.workPreferences];
                            const existingPreference = newPreferences.find(p => p.name === pref);
                            if (existingPreference) {
                              newPreferences.splice(newPreferences.indexOf(existingPreference), 1);
                            } else {
                              newPreferences.push({ name: pref, value: pref });
                            }
                            setFormData({ ...formData, workPreferences: newPreferences });
                          }}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            formData.workPreferences.find(p => p.name === pref)
                              ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                          } hover:bg-neutral-800`}
                        >
                          {pref}
                        </button>
                      ))
                    ) : (
                      formData.workPreferences.map((pref) => (
                        <div
                          key={pref.name}
                          className="px-4 py-2 rounded-lg border bg-blue-500/20 border-blue-500 text-blue-400"
                        >
                          {pref.name}
                        </div>
                      ))
                    )}
                  </div>
                </CardBody>

                <CardBody className="relative overflow-hidden rounded-xl border border-slate-800 bg-gray-900 p-8">
                  <h2 className="mb-4 text-xl font-semibold text-white">Disliked Work Areas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isEditing ? (
                      dislikedWorkAreas.map((dislike) => (
                        <button
                          key={dislike}
                          type="button"
                          onClick={() => {
                            const newDislikes = [...formData.dislikes];
                            const existingDislike = newDislikes.find(d => d === dislike);
                            if (existingDislike) {
                              newDislikes.splice(newDislikes.indexOf(existingDislike), 1);
                            } else {
                              newDislikes.push(dislike);
                            }
                            setFormData({ ...formData, dislikes: newDislikes });
                          }}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            formData.dislikes?.includes(dislike)
                              ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                          } hover:bg-neutral-800`}
                        >
                          {dislike}
                        </button>
                      ))
                    ) : (
                      formData.dislikes && formData.dislikes.length > 0 ? (
                        formData.dislikes.map((dislike) => (
                          <div
                            key={dislike}
                            className="px-4 py-2 rounded-lg border bg-rose-500/20 border-rose-500 text-rose-400"
                          >
                            {dislike}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 col-span-3">Belum ada area kerja yang tidak disukai</p>
                      )
                    )}
                  </div>
                </CardBody>
              </div>

            </div>

            {/* Contact & Portfolio */}
            <CardBody className="relative overflow-hidden rounded-xl border border-slate-800 bg-gray-900 p-8">
              <h2 className="mb-4 text-xl font-semibold text-white">Contact & Portfolio</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                  ) : (
                    <p className="text-slate-400">{formData.phone || 'No phone number added'}</p>
                  )}
                </div>
              </div>
            </CardBody>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
