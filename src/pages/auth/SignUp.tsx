import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { MovingBorder } from "@/components/ui/moving-border";
import { SpotlightButton } from "@/components/ui/spotlight-button";

type Role = '3D Artist' | 'Animator' | 'Compositor' | 'VFX Supervisor' | 'Producer';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as Role,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const roles: Role[] = ['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Debug log
    console.log('Form data before submission:', {
      email: formData.email || 'missing',
      password: formData.password ? 'provided' : 'missing',
      confirmPassword: formData.confirmPassword ? 'provided' : 'missing',
      role: formData.role || 'missing'
    });

    // Validate all required fields
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError('Semua field harus diisi');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate('/profile/setup', { replace: true });
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Gagal membuat akun. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-[22px] max-w-md w-full p-1 bg-black animate-spotlight opacity-100"
          style={{
            background:
              "radial-gradient(400px at 447.121px 316.435px, rgba(255, 255, 255, 0.1), transparent 40%)",
          }}
        />
        <BackgroundGradient className="rounded-[22px] max-w-md w-full p-1 bg-black">
          <div className="bg-neutral-950 rounded-[20px] p-8 h-full">
            <div className="mb-8">
              <MovingBorder duration={3000} className="p-[1px]">
                <h1 className="text-2xl font-bold text-neutral-200 text-center p-4">
                  Bergabung dengan Tim Lite VFX
                </h1>
              </MovingBorder>
              <p className="text-neutral-400 text-center mt-2">
                Daftarkan diri kamu untuk mulai memaksimalkan kinerja dan kolaborasi di tim kami.
              </p>
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-lg mb-4 text-sm shadow-sm backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Pilih Peran
                </label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                >
                  <option value="">Pilih peran...</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <SpotlightButton type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Mendaftarkan...
                  </div>
                ) : (
                  'Lanjutkan'
                )}
              </SpotlightButton>

              <p className="text-neutral-400 text-center text-sm mt-4">
                Sudah punya akun?{' '}
                <Link to="/signin" className="text-blue-400 hover:text-blue-300">
                  Masuk di sini
                </Link>
              </p>
            </form>
          </div>
        </BackgroundGradient>
      </div>
    </div>
  );
}
