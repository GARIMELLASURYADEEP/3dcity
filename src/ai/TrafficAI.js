import Vehicle from '../entities/Vehicle.js'
import { randRange } from '../utils/MathUtils.js'

export default class TrafficAI{
  constructor(scene){ this.scene = scene; this.vehicles = [] }

  spawn(n=20){
    for(let i=0;i<n;i++){
      const v = new Vehicle()
      v.mesh.position.set(randRange(-400,400),1,randRange(-400,400))
      const path = [ {x:v.mesh.position.x+200,z:v.mesh.position.z}, {x:v.mesh.position.x-200,z:v.mesh.position.z} ]
      v.setPath(path)
      this.vehicles.push(v)
      this.scene.add(v.mesh)
    }
  }

  update(dt){ this.vehicles.forEach(v=>v.update(dt)) }
}
