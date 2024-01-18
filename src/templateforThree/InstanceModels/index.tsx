/* eslint-disable @typescript-eslint/no-explicit-any */
import { Instance, Instances } from '@react-three/drei'

type Props = {
  pos: Array<number>
  scale?: number
  geometry: any
  material: any
  dataList: Array<Data>
}

type Data = {
  pos: Array<number>
  rot?: Array<number>
  scale?: number
}
export default function InstanceModels({ pos, scale = 1, geometry, material, dataList }: Props) {
  return (
    <Instances
      range={dataList.length}
      material={material}
      geometry={geometry}>
      <group
        position={[pos[0], pos[1], pos[2]]}
        scale={scale}>
        {dataList.map((data, index) => (
          <InstanceModel
            key={index}
            pos={data.pos}
            rot={data.rot}
            scale={data.scale}
          />
        ))}
      </group>
    </Instances>
  )
}

function InstanceModel({ pos, rot = [0, 0, 0], scale = 1 }: Data) {
  return (
    <Instance
      position={[pos[0], pos[1], pos[2]]}
      rotation={[rot[0], rot[1], rot[2]]}
      scale={scale}
    />
  )
}
