import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

interface SparklesProps {
  children?: React.ReactNode;
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
  particleColor?: string;
}

const generateSparkle = (minSize: number, maxSize: number, color: string) => {
  const size = Math.random() * (maxSize - minSize) + minSize
  return {
    id: Math.random(),
    size,
    color,
    createdAt: Date.now(),
    style: {
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      zIndex: 2,
    },
  }
}

const DEFAULT_COLOR = '#FFC700'

export const SparklesCore: React.FC<SparklesProps> = ({
  children,
  className = '',
  id = 'sparkles',
  background = 'transparent',
  minSize = 10,
  maxSize = 20,
  speed = 1,
  particleColor = DEFAULT_COLOR,
}) => {
  const [sparkles, setSparkles] = useState<ReturnType<typeof generateSparkle>[]>([])

  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      const now = Date.now()
      const sparkle = generateSparkle(minSize, maxSize, particleColor)
      
      setSparkles(currentSparkles => {
        const newSparkles = currentSparkles.filter(s => {
          const age = now - s.createdAt
          return age < 750 * speed
        })
        
        if (newSparkles.length < 3) {
          return [...newSparkles, sparkle]
        }
        
        return newSparkles
      })
    }, 50 / speed)

    return () => clearInterval(sparkleInterval)
  }, [minSize, maxSize, speed, particleColor])

  return (
    <div className={cn('relative inline-block', className)} style={{ background }}>
      {children}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.span
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={sparkle.style}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.75 / speed }}
          >
            <svg
              className="absolute"
              style={{
                width: sparkle.size,
                height: sparkle.size,
              }}
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                fill={sparkle.color}
              />
            </svg>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
