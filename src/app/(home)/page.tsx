'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useRef } from 'react'
import { Flock } from './Flock'
import { OrbitControls, StatsGl } from '@react-three/drei'

export default function Home() {
  const mouse = useRef([0, 0, false])

  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }: { clientX: any; clientY: any }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  )

  const handleMouseDown = (event: { button: number }) => {
    if (event.button !== 2) {
      mouse.current[2] = true
    }
  }

  const handleMouseUp = (event: { button: number }) => {
    if (event.button !== 2) {
      mouse.current[2] = false
    }
  }

  console.log(mouse)
  return (
    <div
      className="h-screen w-screen bg-gray-900"
      onPointerMove={onMouseMove}
      onPointerDown={handleMouseDown}
      onPointerUp={handleMouseUp}>
      <Suspense fallback={null}>
        <Canvas camera={{ fov: 75, position: [0, 0, 70] }}>
          <ambientLight intensity={5} />
          {/* <OrbitControls enableZoom={false} /> */}
          <Flock
            position={[100, 10, 0]}
            count={50}
            model="/glb/blue_whale.glb"
            scale={1}
          />
          <StatsGl />
        </Canvas>
      </Suspense>
    </div>
  )
}
