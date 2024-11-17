import React from 'react';
import { useRouteError } from 'react-router-dom';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { SparklesCore } from '@/components/ui/sparkles';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { SpotlightButton } from '@/components/ui/spotlight-button';

export default function RouterErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <BackgroundGradient className="rounded-[22px] max-w-3xl w-full p-8">
        <div className="relative">
          <div className="absolute inset-0">
            <SparklesCore
              id="error-sparkles"
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleCount={50}
              className="w-full h-full"
              particleColor="#FF3333"
            />
          </div>
          <div className="relative z-10 text-center space-y-6">
            <TextGenerateEffect
              words="Oops! Terjadi Kesalahan"
              className="text-3xl font-bold text-red-500"
            />
            <div className="text-neutral-300 mt-4">
              <p className="text-lg mb-2">Maaf, terjadi kesalahan saat memuat halaman.</p>
              <p className="text-sm text-neutral-400">{error.message}</p>
            </div>
            <div className="mt-8">
              <SpotlightButton onClick={() => window.location.href = '/'}>
                Kembali ke Dashboard
              </SpotlightButton>
            </div>
          </div>
        </div>
      </BackgroundGradient>
    </div>
  );
}
