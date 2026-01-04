import Pedestrian from '../entities/Pedestrian.js'
import { randRange } from '../utils/MathUtils.js'

export default class PedestrianAI{
  constructor(scene){ this.scene = scene; this.pedestrians = [] }
  spawn(n=100){
    for(let i=0;i<n;i++){
      const p = new Pedestrian()
      p.mesh.position.set(randRange(-800,800),1,randRange(-800,800))
      const path = [ {x:p.mesh.position.x+10,z:p.mesh.position.z+10}, {x:p.mesh.position.x-10,z:p.mesh.position.z-10} ]
      p.setPath(path)
      this.pedestrians.push(p)
      this.scene.add(p.mesh)
    }
  }
  update(dt){ this.pedestrians.forEach(p=>p.update(dt)) }
}
