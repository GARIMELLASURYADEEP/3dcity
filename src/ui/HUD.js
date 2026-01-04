import GUI from 'lil-gui'

export default class HUD{
  constructor(engine){
    this.engine = engine
    this.gui = new GUI()
    this.state = { traffic:true, pedestrians:true, time:12 }
    this.gui.add(this.state, 'traffic')
    this.gui.add(this.state, 'pedestrians')
    this.gui.add(this.state, 'time', 0,24,0.1).onChange(v=> this.setTime(v))
  }

  setTime(v){
    const t = (v/24) * Math.PI*2
    this.engine.sceneMgr.sun.position.set(Math.cos(t)*200, Math.sin(t)*200, 100)
  }
}
