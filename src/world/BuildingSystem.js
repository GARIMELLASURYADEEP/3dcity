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
    // We'll group buildings by (textureIndex, verticalRepeat) to avoid creating
    // a material per building while allowing texture scale to vary with height.
    const textures = TextureManager.buildingTextures

    const groups = new Map()

    const hashPick = (x, z) => {
      // deterministic hash to choose texture index so buildings keep same look
      const v = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
      return Math.abs(Math.floor(v)) % textures.length
    }

    for(let i=0;i<this.count;i++){
      const x = randRange(-config.citySize/2 + 50, config.citySize/2 - 50)
      const z = randRange(-config.citySize/2 + 50, config.citySize/2 - 50)
      const h = Math.max(3, Math.round(randRange(3, 60)))

      const texIdx = hashPick(x, z)
      const verticalRepeat = Math.max(1, h / 3)
      const key = `${texIdx}_${Math.round(verticalRepeat*100)/100}`

      const matrix = new THREE.Matrix4()
      matrix.makeScale(10, h * 2, 10)
      matrix.setPosition(x, h, z)

      if(!groups.has(key)) groups.set(key, {texIdx, verticalRepeat, matrices: []})
      groups.get(key).matrices.push(matrix)
    }

    // Create instanced meshes per group (shared material per group)
    const boxGeo = new THREE.BoxGeometry(1,1,1)
    groups.forEach(({texIdx, verticalRepeat, matrices}) => {
      const material = TextureManager.getBuildingMaterial(texIdx, verticalRepeat)
      const inst = new THREE.InstancedMesh(boxGeo, material, matrices.length)
      inst.frustumCulled = true
      inst.castShadow = true
      inst.receiveShadow = true

      for(let i=0;i<matrices.length;i++) inst.setMatrixAt(i, matrices[i])
      inst.instanceMatrix.needsUpdate = true
      this.scene.add(inst)
      this.instancedGroups.push(inst)
    })
  }

  update(dt){}
}
