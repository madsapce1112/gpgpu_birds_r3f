import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Instance, Instances, useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

type GLTFResult = GLTF & {
  nodes: any
  materials: any
}

//returns a vector towards a point, slows down as we near it
function seek(particle: { position: any; velocity: any; maxVelocity: any; maxForce: any }, target: THREE.Vector3) {
  let { position, velocity, maxVelocity, maxForce } = particle
  let desired = target.clone()
  desired.sub(position)
  let length = desired.length()
  desired.normalize()
  desired.multiplyScalar(maxVelocity)
  desired.sub(velocity)
  if (length > 0) {
    desired.divideScalar(1 / length)
  }
  desired.clampLength(-maxForce, maxForce)
  return desired
}

//returns a vector towards a point, slows down as we near it
function flee(particle: { position: any; velocity: any; maxVelocity: any; maxForce: any }, target: any) {
  let { position, velocity, maxVelocity, maxForce } = particle
  let desired = position.clone()
  desired.sub(target)
  let length = desired.length()
  desired.normalize()
  desired.multiplyScalar(maxVelocity)
  desired.sub(velocity)
  if (length > 20) {
    desired.multiplyScalar(0.0)
  }
  desired.z = 0
  desired.clampLength(-maxForce, maxForce)
  return desired
}

//Run alignment, cohesion, and separation as a single loop
function runFlocking(particle: any, particles: string | any[], index: number, mousePosition: THREE.Vector3, mousePressed: any) {
  let { maxVelocity, maxForce, velocity, t } = particle

  //The following const values configure the distances at which to follow other boids
  const desiredSeparation = 8 + 5 * Math.sin(t * 0.1)
  const desiredAlignment = 30
  const desiredCohesion = 12

  //Weights for the flocking simulation
  const separationMix = 2.6
  const alignmentMix = 0.6
  const cohesionMix = 0.2
  const mouseMix = 0.8 + Math.sin(t * 0.3) * 0.3

  let separation = new THREE.Vector3()
  let alignment = new THREE.Vector3()
  let cohesion = new THREE.Vector3()
  let separationCount = 0
  let alignmentCount = 0
  let cohesionCount = 0

  particle.loopStep++
  let loopStart = particle.loopStep % 2 === 0 ? 0 : particles.length / 2
  let loopEnd = particle.loopStep % 2 === 0 ? particles.length / 2 : particles.length

  for (let i = loopStart; i < loopEnd; ++i) {
    let { position, velocity } = particles[i]
    let d = particle.position.distanceTo(position)

    //Calculate separation steering forces
    if (d > 0 && d < desiredSeparation) {
      let diff = particle.position.clone()
      diff.sub(position)
      diff.divideScalar(d)
      separation.add(diff)
      separationCount++
    }

    //Calculate cohesion steering forces
    if (d > 0 && d < desiredCohesion) {
      cohesion.add(position)
      cohesionCount++
    }

    //Calculate alignment steering forces
    if (d > 0 && d < desiredAlignment) {
      alignment.add(velocity)
      alignmentCount++
    }
  }

  //Post-process separation
  if (separationCount > 0) {
    separation.divideScalar(separationCount)
  }
  if (separation.length() > 0) {
    separation.normalize()
    separation.multiplyScalar(maxVelocity)
    separation.sub(velocity)
    separation.clampLength(-maxForce, maxForce)
  }

  //Post process cohesion
  if (cohesionCount > 0) {
    cohesion.divideScalar(cohesionCount)
  }

  //Post-process alignment
  if (alignmentCount > 0) {
    alignment.divideScalar(alignmentCount)
  }
  if (alignment.length() > 0) {
    alignment.normalize()
    alignment.multiplyScalar(maxVelocity)
    alignment.sub(velocity)
    alignment.clampLength(-maxForce, maxForce)
  }

  particle.accelleration.add(separation.multiplyScalar(separationMix))
  particle.accelleration.add(seek(particle, cohesion).multiplyScalar(cohesionMix))

  particle.accelleration.add(alignment.multiplyScalar(alignmentMix))

  if (mousePressed) {
    particle.accelleration.add(flee(particle, mousePosition).multiplyScalar(2))
  } else {
    let temp = particle.position.clone()
    temp.sub(mousePosition)
    temp.normalize()
    let perp = new THREE.Vector3(temp.y, temp.x, temp.z)

    perp.multiplyScalar(5)
    temp.addVectors(mousePosition, perp)

    particle.accelleration.add(seek(particle, temp).multiplyScalar(mouseMix))
  }
}

const Fish = ({ particle, particles, aspect, mouse, i }: { particle: any; particles: any; aspect: number; mouse: any; i: number }) => {
  const mesh = useRef<THREE.InstancedMesh>(null)
  useFrame((state) => {
    if (mesh.current) {
      let mousePosition = new THREE.Vector3(mouse.current[0] / aspect, -mouse.current[1] / aspect, 0)

      let { timeSpeed, maxVelocity } = particle

      particle.t += timeSpeed

      particle.accelleration.x = 0
      particle.accelleration.y = 0
      particle.accelleration.z = 0

      runFlocking(particle, particles, i, mousePosition, mouse.current[2])

      //Make sure our particles don't change direction too quickly
      particle.accelleration.multiplyScalar(0.15)

      particle.velocity.multiplyScalar(0.999)
      particle.velocity.add(particle.accelleration)
      particle.velocity.clampScalar(-maxVelocity, maxVelocity)

      particle.position.add(particle.velocity)

      // Update the dummy object
      mesh.current.position.set(particle.position.x, particle.position.y, particle.position.z)

      let velocityScale = particle.velocity.length() / maxVelocity

      mesh.current.scale.set(velocityScale * 30, 30 * velocityScale, 30 * velocityScale)

      let lookTarget = mesh.current.position.clone()
      lookTarget.add(particle.velocity)

      mesh.current.lookAt(lookTarget)
      mesh.current.updateMatrix()
      // And apply the matrix to the instanced item
    }
  })
  return <Instance ref={mesh} />
}

export function Flock({ count, mouse }: { count: number; mouse: any }) {
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const { nodes, materials, animations } = useGLTF('/glb/angelfish.glb') as GLTFResult

  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 1000
      const timeSpeed = (0.01 + Math.random() / 200) / 2
      const velocity = new THREE.Vector3(0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random())
      const position = new THREE.Vector3((0.5 - Math.random()) * 100, (0.5 - Math.random()) * 100, (0.5 - Math.random()) * 100)
      const maxVelocity = 0.5 + Math.random() * 0.5
      const maxForce = 0.1
      const accelleration = new THREE.Vector3(0, 0, 0)
      const loopStep = 0
      temp.push({
        t,
        timeSpeed,
        position,
        velocity,
        maxVelocity,
        maxForce,
        accelleration,
        loopStep
      })
    }
    return temp
  }, [count])

  // useEffect(() => {
  //   animations[names[0]]!.play()
  // })
  // // The innards of this hook will run every frame

  return (
    <>
      <Instances
        geometry={nodes.object.geometry}
        range={count}
        material={materials['M_angelfish']}>
        <group position={[0, 0, 0]}>
          {particles.map((particle, i) => (
            <Fish
              key={i}
              particle={particle}
              particles={particles}
              aspect={aspect}
              mouse={mouse}
              i={i}
            />
          ))}
        </group>
      </Instances>
    </>
  )
}
