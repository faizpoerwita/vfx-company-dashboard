import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import API from '@/utils/api';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { MovingBorder } from "@/components/ui/moving-border";
import { SpotlightButton } from "@/components/ui/spotlight-button";
import { toast } from 'react-hot-toast';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface WorkPreference {
  name: string;
  selected: boolean;
}

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    skills: [] as Skill[],
    workPreferences: [
      { name: 'Bekerja dalam tim', selected: false },
      { name: 'Bekerja mandiri', selected: false },
      { name: 'Proyek jangka panjang', selected: false },
      { name: 'Proyek jangka pendek', selected: false },
      { name: 'Remote work', selected: false },
    ] as WorkPreference[],
    learningInterests: '',
    portfolio: '',
  });

  const skillOptions = [
    '3D Modeling',
    'Texturing',
    'Rigging',
    'Animation',
    'Compositing',
    'Lighting',
    'Rendering',
    'Motion Graphics',
    'VFX Simulation',
  ];

  const handleSkillAdd = (skillName: string, level: Skill['level']) => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: skillName, level }],
    }));
  };

  const handleWorkPreferenceToggle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workPreferences: prev.workPreferences.map((pref, i) => 
        i === index ? { ...pref, selected: !pref.selected } : pref
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update the entire profile at once
      await API.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills,
        workPreferences: formData.workPreferences.filter(p => p.selected).map(p => ({
          name: p.name,
          value: 'true'
        })),
        learningInterests: formData.learningInterests,
        portfolio: formData.portfolio,
        onboardingCompleted: true
      });
      
      toast.success('Profil berhasil disimpan!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Gagal menyimpan profil. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <BackgroundGradient className="rounded-[22px] p-1 bg-black">
          <div className="bg-neutral-950 rounded-[20px] p-8">
            <div className="mb-8">
              <MovingBorder duration={3000} className="p-[1px]">
                <h1 className="text-2xl font-bold text-neutral-200 text-center p-4">
                  Buat Profil Kerja Kamu
                </h1>
              </MovingBorder>
              <p className="text-neutral-400 text-center mt-2">
                Isi formulir ini untuk membantu kami memahami keahlian dan preferensimu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-200 mb-2">
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-200 mb-2">
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Bio Singkat
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Keahlian
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {skillOptions.map((skill) => (
                    <div key={skill} className="relative">
                      <select
                        className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => handleSkillAdd(skill, e.target.value as Skill['level'])}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {skill}
                        </option>
                        <option value="Beginner">Pemula</option>
                        <option value="Intermediate">Menengah</option>
                        <option value="Advanced">Mahir</option>
                        <option value="Expert">Ahli</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Preferensi Kerja
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.workPreferences.map((pref, index) => (
                    <button
                      key={pref.name}
                      type="button"
                      onClick={() => handleWorkPreferenceToggle(index)}
                      className={`px-4 py-2 rounded-lg border ${
                        pref.selected
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      } hover:bg-neutral-800 transition-colors`}
                    >
                      {pref.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Minat Pengembangan
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.learningInterests}
                  onChange={(e) => setFormData({ ...formData, learningInterests: e.target.value })}
                  placeholder="Apa yang ingin kamu pelajari atau tingkatkan?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://your-portfolio.com"
                />
              </div>

              <SpotlightButton type="submit" className="w-full">
                Simpan Profil
              </SpotlightButton>
            </form>
          </div>
        </BackgroundGradient>
      </div>
    </div>
  );
}
