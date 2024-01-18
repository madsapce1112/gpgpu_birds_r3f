import { useGLTF } from '@react-three/drei'

type Props = {
  pos?: Array<number>
  rot?: Array<number>
  scale?: number
  url: string
  layer?: number
  visible?: boolean
}

export default function ModelLoader({ pos = [0, 0, 0], rot = [0, 0, 0], scale = 1, url, layer = 0, visible = true }: Props) {
  const { scene } = useGLTF(url)
  return (
    <primitive
      object={scene.clone()}
      position={[pos[0], pos[1], pos[2]]}
      rotation={[rot[0], rot[1], rot[2]]}
      scale={scale}
      layers={layer}
      visible={visible}
    />
  )
}
