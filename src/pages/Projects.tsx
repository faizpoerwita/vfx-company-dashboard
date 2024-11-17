import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import API from '@/utils/api';
import { toast } from 'react-hot-toast';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { SparklesCore } from '@/components/ui/sparkles';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { MovingBorder } from '@/components/ui/moving-border';
import { SpotlightButton } from '@/components/ui/spotlight-button';
import { z } from 'zod';

// Project validation schema
const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nama proyek wajib diisi'),
  description: z.string(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ON_HOLD']),
  deadline: z.string().datetime(),
  clientId: z.string(),
  teamMembers: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

type Project = z.infer<typeof projectSchema>;

const Projects: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.get<Project[]>('/projects', {
          headers: {
            'X-User-Role': user?.role || 'guest',
          },
        });

        const validatedProjects = response.map(project => {
          try {
            return projectSchema.parse(project);
          } catch (err) {
            console.error('Data proyek tidak valid:', err);
            return null;
          }
        }).filter((project): project is Project => project !== null);

        setProjects(validatedProjects);
      } catch (err) {
        console.error('Gagal memuat proyek:', err);
        setError('Gagal memuat daftar proyek');
        toast.error('Gagal memuat daftar proyek');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, user?.role]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <BackgroundGradient className="rounded-[22px] p-1 bg-black">
          <MovingBorder className="p-[1px]">
            <Card className="relative group bg-neutral-950 p-6 rounded-[20px] hover:bg-neutral-900/50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2 text-red-400">Error</h3>
              <p className="text-neutral-200">{error}</p>
            </Card>
          </MovingBorder>
        </BackgroundGradient>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-500/20 text-blue-400';
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400';
      case 'ON_HOLD':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktif';
      case 'COMPLETED':
        return 'Selesai';
      case 'ON_HOLD':
        return 'Ditunda';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header with Sparkles */}
      <div className="relative h-32 mb-12">
        <div className="absolute inset-0">
          <SparklesCore
            id="projects-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleCount={150}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <MovingBorder duration={3000} className="p-[1px] w-full h-full">
          <div className="relative flex items-center justify-center w-full h-full bg-neutral-950 rounded-lg">
            <TextGenerateEffect
              words="Daftar Proyek VFX"
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-600"
            />
          </div>
        </MovingBorder>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <BackgroundGradient key={project.id} className="rounded-[22px] p-1 bg-black">
            <MovingBorder className="p-[1px] h-full">
              <Card className="relative group bg-neutral-950 p-6 rounded-[20px] h-full hover:bg-neutral-900/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-neutral-200">{project.name}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </div>
                </div>
                <p className="text-neutral-400 mb-4">{project.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-300">
                    <span className="text-neutral-500">Tenggat Waktu:</span>{' '}
                    {new Date(project.deadline).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-neutral-300">
                    <span className="text-neutral-500">Anggota Tim:</span>{' '}
                    {project.teamMembers.length} orang
                  </p>
                  <p className="text-sm text-neutral-300">
                    <span className="text-neutral-500">Dibuat:</span>{' '}
                    {new Date(project.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="mt-6">
                  <SpotlightButton className="w-full">
                    Lihat Detail
                  </SpotlightButton>
                </div>
                <div
                  className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.06), transparent 40%)",
                  }}
                />
              </Card>
            </MovingBorder>
          </BackgroundGradient>
        ))}
      </div>
    </div>
  );
};

export default Projects;
