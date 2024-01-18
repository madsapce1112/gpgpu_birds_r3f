/* eslint-disable @typescript-eslint/no-explicit-any */
import { DoubleSide } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Text, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

type GLTFResult = GLTF & {
  nodes: any
  materials: any
}

export const Earth = () => {
  const { nodes, materials } = useGLTF('/glb/earth.glb') as GLTFResult
  const earthRef = useRef<any>()

  useFrame(() => {
    earthRef.current.rotation.y += 0.01
  })

  return (
    <>
      <group
        ref={earthRef}
        rotation={[-Math.PI / 2 - 0.5, -0.4, 0]}
        position={[0, 0.7, -10]}
        scale={0.5}>
        <mesh
          geometry={nodes.object_out.geometry}
          scale={0.3}>
          <meshStandardMaterial
            map={materials['basic_out'].map}
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.6}
            side={DoubleSide}
          />
        </mesh>
        <mesh
          geometry={nodes.object_in.geometry}
          scale={0.3}>
          <meshStandardMaterial
            map={materials['basic_in'].map}
            metalness={0.4}
            // roughness={0.6}
            color={'#C5B800'}
            transparent
            opacity={0.6}
            side={DoubleSide}
          />
        </mesh>
      </group>
      <Text
        scale={1}
        position={[0, -5.5, -5]}
        color={'#929090'}>
        WORLDWIDE
      </Text>
    </>
  )
}
