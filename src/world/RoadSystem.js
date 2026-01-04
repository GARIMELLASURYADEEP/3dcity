import * as THREE from 'three'
import config from '../config/cityConfig.js'
import TextureManager from '../utils/TextureManager.js'

export default class RoadSystem{
  constructor(scene){ this.scene = scene }
  createGrid(){
    const size = config.citySize
    const step = config.blockSize
    const roadMat = TextureManager.getRoadMaterial()
    const tileFactor = 8
    for(let i=-size/2;i<=size/2;i+=step){
      const g = new THREE.PlaneGeometry(size, config.roadWidth)
      // adjust UVs so texture tiles along the long axis
      const uvs = g.attributes.uv.array
      const repeatX = size / tileFactor
      const repeatY = config.roadWidth / 4
      for(let k=0;k<uvs.length;k+=2){
        uvs[k] *= repeatX
        uvs[k+1] *= repeatY
      }
      g.attributes.uv.needsUpdate = true
      const m = new THREE.Mesh(g, roadMat)
      m.rotation.x = -Math.PI/2
      m.position.z = i
      m.receiveShadow = true
      this.scene.add(m)

      const g2 = new THREE.PlaneGeometry(config.roadWidth, size)
      const uvs2 = g2.attributes.uv.array
      const repeatX2 = size / tileFactor
      const repeatY2 = config.roadWidth / 4
      for(let k=0;k<uvs2.length;k+=2){
        uvs2[k] *= repeatY2
        uvs2[k+1] *= repeatX2
      }
      g2.attributes.uv.needsUpdate = true
      const m2 = new THREE.Mesh(g2, roadMat)
      m2.rotation.x = -Math.PI/2
      m2.position.x = i
      m2.receiveShadow = true
      this.scene.add(m2)
    }
  }
}
