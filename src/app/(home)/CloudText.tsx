/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three'
import { damp3 } from 'maath/easing'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'

const vertexShader = `
uniform float uPixelRatio;
uniform float uSize;
uniform float time;
uniform vec3 mousePos;

attribute float vScale;

void main() {
  vec3 tempPos = vec3(position.xyz);
  
  vec3 seg = position - mousePos;
  vec3 dir = normalize(seg);
  float dist = length(seg);
  if (dist < 30.){
    float force = clamp(1. / (dist * dist), 0., 1.);
    tempPos += dir * force * 1.1;
  }

  vec4 modelPosition = modelMatrix * vec4(tempPos, 1.);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

 

  gl_Position = projectionPosition;
  gl_PointSize = uSize ;
}`

const fragmentShader = `
void main() {
  float _radius = 0.4;
  vec2 dist = gl_PointCoord-vec2(0.5);
  float strength = 1.-smoothstep(
    _radius-(_radius*0.4),
        _radius+(_radius*0.3),
        dot(dist,dist)*4.0
    );

  gl_FragColor = vec4(7., 3., 0.2, strength);
}`

export const CloudText = () => {
  let time = 0
  let initPos: any[] = []
  let middlePos: any[] = []
  let lastPos: any[] = []
  let targetPos: any[] = []

  const pointRef = useRef<any>()
  const geometryRef = useRef<THREE.BufferGeometry<THREE.NormalBufferAttributes>>(null)
  const shaderMaterial = useRef<THREE.ShaderMaterial>(null)
  const uniforms = {
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 4 },
    time: {
      value: 0
    },
    mousePos: { value: new THREE.Vector3() }
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 0
  const textCtx = canvas.getContext('2d')

  const stringBox = {
    wTexture: 0,
    wScene: 0,
    hTexture: 0,
    hScene: 0
  }

  const fontName = 'Verdana'
  const textureFontSize = 30
  const fontScaleFactor = 0.08

  const sampleCoordinates = (string: string) => {
    stringBox.wTexture = textureFontSize * 0.7
    stringBox.hTexture = textureFontSize

    // Draw text
    canvas.width = stringBox.wTexture * string.length
    canvas.height = stringBox.hTexture

    if (textCtx) {
      textCtx.font = '100 ' + textureFontSize + 'px ' + fontName
      textCtx.fillStyle = '#2a9d8f'
      textCtx.fillText(string, 0, 0.8 * stringBox.hTexture)
    }

    // Sample coordinates
    const textureCoordinates = []
    if (stringBox.wTexture > 0) {
      const imageData = textCtx && textCtx.getImageData(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < canvas.height; i += 1) {
        for (let j = 0; j < canvas.width; j += 1) {
          if (imageData && imageData.data[(j + i * canvas.width) * 4] > 0) {
            textureCoordinates.push({
              x: j,
              y: i
            })
          }
        }
      }
    }
    return textureCoordinates
  }

  const refreshText = (text: string) => {
    let textureCoordinates = sampleCoordinates(text)
    const thePoints: THREE.Vector3[] = []
    textureCoordinates = textureCoordinates.map((c) => ({ x: (c.x - canvas.width / 2) * fontScaleFactor, y: c.y * fontScaleFactor }))
    const sortedY = textureCoordinates.map((v) => v.y).sort((a, b) => b - a)[0]
    stringBox.hScene = sortedY

    textureCoordinates.forEach((p) => {
      const a = new THREE.Vector3(p.x, stringBox.hScene - p.y, Math.random() / 10)
      thePoints.push(a)
    })
    return thePoints
  }

  const formatCoordinates = (order: boolean) => {
    if (order) {
      initPos = refreshText('GENERATIONS')
      lastPos = refreshText('STUDIOS COMPANY')
    } else {
      initPos = refreshText('STUDIOS COMPANY')
      lastPos = refreshText('GENERATIONS')
    }

    const maxLength = Math.max(initPos.length, lastPos.length)
    middlePos = []
    for (let i = 0; i < maxLength; i++) {
      const x_coordinate = (Math.random() - 0.5) * Math.random() * 100
      const y_coordinate = (Math.random() - 0.5) * Math.random() * 100
      middlePos[i] = new THREE.Vector3(x_coordinate, y_coordinate, 20)
    }
  }
  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let idx = 1
    formatCoordinates(true)
    setInterval(() => {
      formatCoordinates(idx % 2 === 0 ? true : false)
      idx++
      console.log(idx)
    }, 12000)

    targetPos = initPos
  }, [])

  const translateParticle = (particlePos: any[], particleMiddlePos: any[], delta: number | undefined, zoomType: string) => {
    if (zoomType === 'zoomIn') {
      for (let i = 0; i < particlePos.length; i++) {
        damp3(particlePos[i], particleMiddlePos[i], 1, delta)
      }
      return particlePos
    } else if (zoomType === 'zoomOut') {
      for (let i = 0; i < particlePos.length; i++) {
        damp3(particleMiddlePos[i], particlePos[i], 1, delta)
      }
      return particleMiddlePos
    } else return []
  }

  useFrame((state, delta) => {
    time = parseInt(`${(state.clock.oldTime - state.clock.startTime) / 1000}`)
    if (time > 0) {
      if (time > 0 && time % 12 >= 2 && time % 12 < 6) targetPos = translateParticle(initPos, middlePos, delta, 'zoomIn')
      if (time % 12 > 6 && time % 12 < 11) targetPos = translateParticle(lastPos, middlePos, delta, 'zoomOut')
      if (time > 0 && time % 12 === 0) geometryRef.current?.setFromPoints(targetPos)
    }
    geometryRef.current?.setFromPoints(targetPos)
  })

  return (
    <group>
      <mesh
        visible={false}
        position={[-5, -3.5, 0]}
        onPointerMove={(e) => {
          uniforms.mousePos.value.x = e.point.x
          uniforms.mousePos.value.y = e.point.y
        }}
        onPointerOut={() => {
          uniforms.mousePos.value.x = -150
          uniforms.mousePos.value.y = -150
        }}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color={'#FFFDFD'} />
      </mesh>
      <points ref={pointRef}>
        <bufferGeometry ref={geometryRef} />
        <shaderMaterial
          ref={shaderMaterial}
          transparent
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>
    </group>
  )
}
