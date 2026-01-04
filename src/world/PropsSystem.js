import * as THREE from 'three'
import { randRange } from '../utils/MathUtils.js'

export default class PropsSystem{
  constructor(scene){ this.scene = scene }
  populate(){
    const geo = new THREE.ConeGeometry(1,6,6)
    const mat = new THREE.MeshStandardMaterial({color:0x2b7a2b})
    for(let i=0;i<200;i++){
      const m = new THREE.Mesh(geo, mat)
      m.position.set(randRange(-800,800),3,randRange(-800,800))
      m.castShadow = false
      m.receiveShadow = false
      this.scene.add(m)
    }
  }
  update(dt){}
}
