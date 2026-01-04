import * as THREE from 'three'

export default class Vehicle{
  constructor(){
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(2,1,4), new THREE.MeshStandardMaterial({color:0xff0000}))
    this.speed = 20 + Math.random()*10
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
    if(dist < 1){ this.targetIndex = (this.targetIndex + 1) % this.path.length; return }
    dir.normalize()
    pos.addScaledVector(dir, this.speed * dt)
    this.mesh.lookAt(p.x, pos.y, p.z)
  }
}
