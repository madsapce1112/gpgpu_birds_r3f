/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Earth } from './Earth'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { CloudText } from './CloudText'
import { Earth } from './Earth'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export default function Scene() {
  function CameraRig({ children }: any) {
    const group = useRef<any>()
    useFrame((state, delta) => {
      easing.damp3(state.camera.position, [0, 0, 20], 0.25, delta)
      easing.dampE(group.current.rotation, [0, -state.pointer.x / 5, 0], 0.25, delta)
    })
    return <group ref={group}>{children}</group>
  }
  return (
    <group>
      <ambientLight intensity={1} />
      <pointLight
        scale={10}
        position={[-9, 10, 15]}
        color={'#382BE9'}
        intensity={5}
        decay={0}
      />
      <pointLight
        scale={10}
        position={[-15, 0, -10]}
        color={'#E92B2B'}
        intensity={5}
        decay={0}
      />
      <pointLight
        scale={10}
        position={[0, 20, -2]}
        color={'#41E92B'}
        intensity={5}
        decay={0}
      />

      <CameraRig>
        <Earth />
        <CloudText />
      </CameraRig>
      <EffectComposer>
        <Bloom intensity={0.2} />
      </EffectComposer>
    </group>
  )
}
