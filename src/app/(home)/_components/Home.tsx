'use client'
import Scene from '@/app/(home)/Scene'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

export const Home = () => (
  <>
    <div className="absolute left-0 top-0 h-screen w-screen">
      <Suspense fallback={null}>
        <Canvas
          performance={{ min: 0.5 }}
          camera={{
            position: [0, 0, 15.5],
            near: 0.1,
            fov: 60
          }}
          gl={{
            powerPreference: 'high-performance',
            alpha: true,
            antialias: false,
            stencil: true,
            logarithmicDepthBuffer: false
          }}
          shadows>
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  </>
)
