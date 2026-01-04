import * as THREE from 'three'

export default class Pedestrian{
  constructor(){
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(0.8,1.8,0.6), new THREE.MeshStandardMaterial({color:0x8888ff}))
    this.speed = 2 + Math.random()*1.5
    this.path = []
    this.targetIndex = 0
  }

  setPath(path){ this.path = path; this.targetIndex = 0 }

  update(dt){
    if(this.path.length===0) return
    const p = this.path[this.targetIndex]
    const pos = this.mesh.position
    const dir = new THREE.Vector3(p.x - pos.x, 0, p.z - pos.z)
    const dist = dir.length()
    if(dist < 0.5){ this.targetIndex = (this.targetIndex + 1) % this.path.length; return }
    dir.normalize()
    pos.addScaledVector(dir, this.speed * dt)
  }
}
