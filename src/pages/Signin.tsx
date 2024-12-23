import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import security from '@/utils/security';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { Button } from "@/components/ui/aceternity/moving-border";
import { cn } from "@/utils/cn";

const signinSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(7, 'Password minimal 7 karakter'),
});

const Signin = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = signinSchema.parse(formData);
      const result = await signin({
        email: validatedData.email,
        password: validatedData.password
      });
      
      if (result.success) {
        toast.success('Berhasil masuk');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Gagal masuk');
      }
    } catch (error) {
      console.error('Signin error:', error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan saat masuk');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: security.sanitizeInput(value),
    }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-black via-neutral-950 to-black relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,0.15),rgba(0,0,0,0))] animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(24,24,27,0.1),rgba(0,0,0,0))] animate-[pulse_6s_ease-in-out_infinite]" />
      
      <div className="relative w-full max-w-md px-4 sm:px-8 py-8 sm:py-12 mx-auto">
        {/* Enhanced glow effects */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800/20 via-neutral-800/40 to-neutral-800/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-tilt" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/10 via-neutral-900/5 to-transparent rounded-3xl opacity-50" />
        
        {/* Content container with enhanced backdrop blur */}
        <div className="relative z-10 backdrop-blur-3xl rounded-3xl p-8 border border-neutral-800/50 shadow-2xl transform-gpu hover:scale-[1.01] transition-all duration-300">
          {/* Logo and Title with enhanced animations */}
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
                Masuk ke Dashboard
              </h1>
              <p className="text-sm text-neutral-400 transition-colors duration-200 hover:text-neutral-300">
                Kelola proyek VFX Anda dengan mudah
              </p>
            </div>
          </div>

          {/* Sign In Form with enhanced interactions */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 select-none">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-800/50 to-neutral-800/50 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 blur animate-tilt" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
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
                    placeholder="nama@litevfx.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between select-none">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-neutral-400 hover:text-white transition-all duration-200 hover:translate-x-0.5 transform-gpu relative group"
                  >
                    Lupa password?
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full opacity-50" />
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-800/50 to-neutral-800/50 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 blur animate-tilt" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
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
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-8 transform-gpu transition-all duration-300 active:scale-[0.98] hover:translate-y-[-2px] hover:shadow-lg relative group overflow-hidden"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Masuk
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </Button>
          </form>

          {/* Enhanced Sign Up Link */}
          <div className="mt-8 text-center select-none">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-neutral-500 hover:text-white transition-all duration-200 text-sm group inline-flex items-center gap-1"
            >
              Belum punya akun?{" "}
              <span className="font-medium text-neutral-300 group-hover:text-white transition-all duration-200 relative inline-flex items-center gap-1">
                Daftar sekarang
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full opacity-50" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="mt-12 text-center select-none">
        <p className="text-sm text-neutral-500 hover:text-neutral-400 transition-colors duration-200">
          &copy; 2024 Lite VFX. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signin;
