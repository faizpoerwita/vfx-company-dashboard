import { motion } from "framer-motion";
import { BackgroundGradient } from "./background-gradient";
import { SparklesCore } from "./sparkles";

export const SectionLoading = () => {
  return (
    <BackgroundGradient className="rounded-[22px] w-full h-[300px] p-8">
      <div className="relative h-full">
        <div className="absolute inset-0">
          <SparklesCore
            id="loading-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleCount={30}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.div
            className="w-12 h-12 rounded-full border-4 border-neutral-500 border-t-white"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <p className="mt-4 text-neutral-400 animate-pulse">Memuat Data...</p>
        </div>
      </div>
    </BackgroundGradient>
  );
};
