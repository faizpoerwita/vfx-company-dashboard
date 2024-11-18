import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { skillCategories, ROLES } from '@/constants/roles';
import { cn } from "@/utils/cn";
import { AnimatedButton } from "@/components/ui/animated-button";
import { WORK_PREFERENCES, transformPreferencesForBackend } from '@/constants/preferences';
import { z } from 'zod';
import type { UserProfile, SkillLevel } from '@/types/user';

const dislikedWorkAreas = [
  "Tugas berulang",
  "Tenggat waktu ketat",
  "Pekerjaan administratif",
  "Pekerjaan tanpa variasi"
];

const experienceLevels = [
  { value: 'Beginner', label: 'Junior (0-2 tahun)' },
  { value: 'Intermediate', label: 'Intermediate (2-5 tahun)' },
  { value: 'Advanced', label: 'Senior (5+ tahun)' }
] as const;

// Validation schema
const onboardingSchema = z.object({
  firstName: z.string().min(2, 'Nama depan minimal 2 karakter'),
  lastName: z.string().min(2, 'Nama belakang minimal 2 karakter'),
  role: z.enum(Object.values(ROLES) as [string, ...string[]], {
    required_error: 'Role harus dipilih'
  }),
  skills: z.array(z.string()).min(1, 'Pilih minimal satu keahlian'),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const, {
    required_error: 'Level pengalaman harus dipilih'
  }),
  workPreferences: z.array(z.string()).min(1, 'Pilih minimal satu preferensi kerja'),
  dislikedWorkAreas: z.array(z.string()).min(1, 'Pilih minimal satu area yang tidak disukai'),
  portfolio: z.string().url('URL portfolio tidak valid').optional().or(z.literal('')),
  bio: z.string().min(10, 'Bio minimal 10 karakter').max(500, 'Bio maksimal 500 karakter')
});

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || '');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedDislikes, setSelectedDislikes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    experienceLevel: user?.experienceLevel || '',
    portfolio: user?.portfolio || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    console.log('Onboarding - Component mounted or user changed:', {
      user,
      role: user?.role,
      isAuthenticated: !!user,
    });
  }, [user]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setSelectedSkills([]);
  };

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleDislikeToggle = (dislike: string) => {
    setSelectedDislikes(prev =>
      prev.includes(dislike)
        ? prev.filter(d => d !== dislike)
        : [...prev, dislike]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({

      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default button behavior
    
    // Step 1: Basic Information
    if (currentStep === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast.error('Nama depan dan belakang harus diisi');
        return;
      }
      if (!selectedRole) {
        toast.error('Silakan pilih peran Anda');
        return;
      }
    }
    
    // Step 2: Skills
    if (currentStep === 2 && selectedSkills.length === 0) {
      toast.error('Silakan pilih minimal satu keahlian');
      return;
    }
    
    // Step 3: Experience and Bio
    if (currentStep === 3) {
      if (!formData.experienceLevel) {
        toast.error('Silakan pilih level pengalaman Anda');
        return;
      }
      if (!formData.bio.trim()) {
        toast.error('Silakan isi bio singkat Anda');
        return;
      }
    }
    
    // Step 4: Work Preferences
    if (currentStep === 4 && selectedPreferences.length === 0) {
      toast.error('Silakan pilih minimal satu preferensi kerja');
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default button behavior
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate all data
      const validatedData = onboardingSchema.parse({
        ...formData,
        role: selectedRole,
        skills: selectedSkills,
        workPreferences: selectedPreferences,
        dislikedWorkAreas: selectedDislikes
      });

      setLoading(true);

      // Transform work preferences to match backend schema
      const workPrefs = transformPreferencesForBackend(validatedData.workPreferences);

      // Transform skills to match backend schema
      const skillsData = validatedData.skills.map(skill => ({
        name: skill,
        level: validatedData.experienceLevel as SkillLevel
      }));

      const profileData: UserProfile = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        skills: skillsData,
        workPreferences: workPrefs,
        dislikedWorkAreas: validatedData.dislikedWorkAreas,
        experienceLevel: validatedData.experienceLevel,
        portfolio: validatedData.portfolio || '',
        bio: validatedData.bio,
        onboardingCompleted: true
      };

      // Debug logs
      console.log('Profile Data to Submit:', profileData);

      await updateProfile(profileData);
      toast.success('Profil berhasil diperbarui!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Gagal memperbarui profil');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 transition-opacity duration-500 ease-in-out opacity-100">
            <div className="space-y-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nama Depan"
                className={cn(
                  "relative w-full px-4 py-3 rounded-xl",
                  "bg-neutral-950/50 border border-neutral-800",
                  "text-white placeholder-neutral-400",
                  "focus:outline-none focus:ring-[1.5px] focus:ring-neutral-700 focus:border-transparent",
                  "transition-all duration-200 ease-out",
                  "hover:border-neutral-700",
                  "group-hover:bg-neutral-900/50",
                  "transform-gpu group-hover:translate-y-[-1px]"
                )}
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nama Belakang"
                className={cn(
                  "relative w-full px-4 py-3 rounded-xl",
                  "bg-neutral-950/50 border border-neutral-800",
                  "text-white placeholder-neutral-400",
                  "focus:outline-none focus:ring-[1.5px] focus:ring-neutral-700 focus:border-transparent",
                  "transition-all duration-200 ease-out",
                  "hover:border-neutral-700",
                  "group-hover:bg-neutral-900/50",
                  "transform-gpu group-hover:translate-y-[-1px]"
                )}
              />
              <select
                value={selectedRole}
                onChange={(e) => handleRoleSelect(e.target.value)}
                className={cn(
                  "relative w-full px-4 py-3 rounded-xl",
                  "bg-neutral-950/70 border border-neutral-800",
                  "text-white placeholder-neutral-400",
                  "focus:outline-none focus:ring-[1.5px] focus:ring-neutral-700 focus:border-transparent",
                  "transition-all duration-200 ease-out",
                  "hover:border-neutral-700",
                  "group-hover:bg-neutral-900/70",
                  "transform-gpu group-hover:translate-y-[-1px]",
                  "appearance-none"
                )}
                style={{
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\" /></svg>')",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.5em',
                }}
              >
                <option value="">Pilih Role</option>
                {Object.values(ROLES).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 transition-opacity duration-500 ease-in-out opacity-100">
            <div className="grid grid-cols-2 gap-4">
              {selectedRole && skillCategories[selectedRole as keyof typeof skillCategories]?.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSkillToggle(skill);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors",
                    selectedSkills.includes(skill)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 transition-opacity duration-500 ease-in-out opacity-100">
            <div className="space-y-4">
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className={cn(
                  "relative w-full px-4 py-3 rounded-xl",
                  "bg-neutral-950/70 border border-neutral-800",
                  "text-white placeholder-neutral-400",
                  "focus:outline-none focus:ring-[1.5px] focus:ring-neutral-700 focus:border-transparent",
                  "transition-all duration-200 ease-out",
                  "hover:border-neutral-700",
                  "group-hover:bg-neutral-900/70",
                  "transform-gpu group-hover:translate-y-[-1px]",
                  "appearance-none"
                )}
                style={{
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\" /></svg>')",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.5em',
                }}
              >
                <option value="">Pilih Level Pengalaman</option>
                {experienceLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio singkat tentang Anda"
                className={cn(
                  "relative w-full px-4 py-3 rounded-xl",
                  "bg-neutral-950/50 border border-neutral-800",
                  "text-white placeholder-neutral-400",
                  "focus:outline-none focus:ring-[1.5px] focus:ring-neutral-700 focus:border-transparent",
                  "transition-all duration-200 ease-out",
                  "hover:border-neutral-700",
                  "group-hover:bg-neutral-900/50",
                  "transform-gpu group-hover:translate-y-[-1px]",
                  "h-32 resize-none"
                )}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 transition-opacity duration-500 ease-in-out opacity-100">
            <h3 className="text-lg font-medium text-neutral-300">Apa yang Anda sukai dalam pekerjaan?</h3>
            <div className="grid grid-cols-2 gap-4">
              {WORK_PREFERENCES.map((preference) => (
                <button
                  key={preference}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreferenceToggle(preference);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors",
                    selectedPreferences.includes(preference)
                      ? "bg-gradient-to-r from-green-500 to-teal-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  )}
                >
                  {preference}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 transition-opacity duration-500 ease-in-out opacity-100">
            <h3 className="text-lg font-medium text-neutral-300">Apa yang Anda tidak suka dalam pekerjaan?</h3>
            <div className="grid grid-cols-2 gap-4">
              {dislikedWorkAreas.map((dislike) => (
                <button
                  key={dislike}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDislikeToggle(dislike);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors",
                    selectedDislikes.includes(dislike)
                      ? "bg-gradient-to-r from-red-500 to-orange-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  )}
                >
                  {dislike}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-black via-neutral-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,0.15),rgba(0,0,0,0))] animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(24,24,27,0.1),rgba(0,0,0,0))] animate-[pulse_6s_ease-in-out_infinite]" />

      <div className="relative w-full max-w-md px-4 sm:px-8 py-8 sm:py-12 mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800/20 via-neutral-800/40 to-neutral-800/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-tilt" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/10 via-neutral-900/5 to-transparent rounded-3xl opacity-50" />

        <div className="relative z-10 backdrop-blur-3xl rounded-3xl p-8 border border-neutral-800/50 shadow-2xl transform-gpu hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col items-center space-y-8 mb-14">
            <div className="relative group cursor-pointer transform-gpu">
              <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-500 group-hover:duration-200 animate-tilt" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-300" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <img 
                src="https://static.wixstatic.com/media/bb3d40_f2c2a190729d467f96a707a43eb1bcc8~mv2.jpg/v1/fill/w_224,h_224,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/NEW%20LITE_BLACK-05.jpg"
                alt="Lite VFX Logo"
                className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl shadow-lg transform-gpu transition-all duration-300 scale-100 group-hover:scale-[1.02] group-hover:rotate-[2deg]"
                draggable="false"
              />
            </div>
            <div className="text-center space-y-2 select-none">
              <h1 className="text-xl sm:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400 tracking-tight animate-gradient">
                {currentStep === 1 && "Selamat Datang!"}
                {currentStep === 2 && "Keahlian"}
                {currentStep === 3 && "Pengalaman"}
                {currentStep === 4 && "Preferensi Kerja"}
                {currentStep === 5 && "Area Kerja yang Tidak Disukai"}
              </h1>
              <p className="text-sm text-neutral-400 transition-colors duration-200 hover:text-neutral-300">
                {currentStep === 1 && "Isi informasi dasar Anda untuk memulai"}
                {currentStep === 2 && "Pilih keahlian yang Anda miliki"}
                {currentStep === 3 && "Ceritakan lebih lanjut tentang pengalaman Anda"}
                {currentStep === 4 && "Apa yang Anda sukai dalam pekerjaan?"}
                {currentStep === 5 && "Apa yang Anda tidak suka dalam pekerjaan?"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}

            <div className="flex justify-between mt-8 gap-4">
              {currentStep > 1 && (
                <AnimatedButton
                  type="button"
                  onClick={handlePrevious}
                  className="w-1/2"
                >
                  Sebelumnya
                </AnimatedButton>
              )}
              
              {currentStep < 5 ? (
                <AnimatedButton
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === 1 && !selectedRole}
                  className={cn(currentStep === 1 ? "w-full" : "w-1/2")}
                >
                  Selanjutnya
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Menyimpan..." : "Selesai"}
                </AnimatedButton>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="mt-12 text-center select-none">
        <p className="text-sm text-neutral-500 hover:text-neutral-400 transition-colors duration-200">
          &copy; 2024 Lite VFX. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default OnboardingForm;
