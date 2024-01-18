import { Detailed, useGLTF } from '@react-three/drei'

type Props = {
  pos?: Array<number>
  rot?: Array<number>
  scale?: number
  url: string
  layer?: number
  level1?: number
  level2?: number
  level3?: number
}

export default function DetailedLoader({
  pos = [0, 0, 0],
  rot = [0, 0, 0],
  scale = 1,
  url,
  layer = 0,
  level1 = 1,
  level2 = 2,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  level3 = 3
}: Props) {
  const levels = useGLTF([url + '1.glb', url + '2.glb', url + '3.glb'])
  return (
    <Detailed distances={[0, level1, level2]}>
      {levels.map(({ scene }, index) => (
        <group key={index}>
          <primitive
            object={scene.clone()}
            position={[pos[0], pos[1], pos[2]]}
            rotation={[rot[0], rot[1], rot[2]]}
            scale={scale}
            layers={layer}
          />
        </group>
      ))}
    </Detailed>
  )
}
