import * as THREE from 'three'
import config from '../config/cityConfig.js'
import { randRange } from '../utils/MathUtils.js'
import TextureManager from '../utils/TextureManager.js'

export default class BuildingSystem{
  constructor(scene){
    this.scene = scene
    this.count = config.buildingCount || 10000
    this.matrices = []
    this.instancedGroups = []
  }

  createDistricts(){
    const textures = TextureManager.buildingTextures
    const perGroup = Math.ceil(this.count / textures.length)

    for(let t=0;t<textures.length;t++){
      const geo = new THREE.BoxGeometry(1,1,1)
      const material = TextureManager.getBuildingMaterial(t)
      const inst = new THREE.InstancedMesh(geo, material, perGroup)
      // disable casting shadows for instanced buildings to improve performance
      inst.castShadow = false
      inst.receiveShadow = false
      inst.frustumCulled = true

      for(let i=0;i<perGroup;i++){
        const idx = t*perGroup + i
        if(idx >= this.count) break
        const x = randRange(-config.citySize/2 + 50, config.citySize/2 - 50)
        const z = randRange(-config.citySize/2 + 50, config.citySize/2 - 50)
        const h = Math.max(3, Math.round(randRange(3, 60)))
        const matrix = new THREE.Matrix4()
        matrix.makeScale(10, h*2, 10)
        matrix.setPosition(x, h, z)
        inst.setMatrixAt(i, matrix)
      }

      inst.instanceMatrix.needsUpdate = true
      this.scene.add(inst)
      this.instancedGroups.push(inst)
    }
  }

  update(dt){}
}
