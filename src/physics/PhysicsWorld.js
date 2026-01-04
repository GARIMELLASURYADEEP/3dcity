import * as CANNON from 'cannon-es'

export default class PhysicsWorld{
  constructor(){
    this.world = null
    this.bodies = []
  }

  init(scene){
    this.world = new CANNON.World({gravity: new CANNON.Vec3(0,-9.82,0)})
    const ground = new CANNON.Body({mass:0, shape: new CANNON.Plane()})
    ground.quaternion.setFromEuler(-Math.PI/2,0,0)
    this.world.addBody(ground)
  }

  update(dt){
    if(!this.world) return
    this.world.step(1/60, dt, 3)
  }
}
