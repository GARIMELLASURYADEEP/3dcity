import * as THREE from 'three'

export default class TerrainSystem{
  constructor(scene){ this.scene = scene }
  create(){
    const g = new THREE.PlaneGeometry(5000,5000,1,1)
    const m = new THREE.MeshStandardMaterial({color:0x6fbf73})
    const mesh = new THREE.Mesh(g,m)
    mesh.rotation.x = -Math.PI/2
    mesh.receiveShadow = true
    this.scene.add(mesh)
  }
}
