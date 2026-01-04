import Renderer from './Renderer.js'
import SceneManager from './SceneManager.js'
import CameraManager from './CameraManager.js'
import EventBus from './EventBus.js'
import CityGenerator from '../world/CityGenerator.js'
import PhysicsWorld from '../physics/PhysicsWorld.js'
import HUD from '../ui/HUD.js'
import Stats from 'stats.js'

export default class Engine{
  constructor({canvas=document.body}={}){
    this.events = new EventBus()
    this.renderer = new Renderer({canvas})
    this.sceneMgr = new SceneManager()
    this.cameraMgr = new CameraManager(this.renderer.renderer.domElement)
    this.scene = this.sceneMgr.scene
    this.camera = this.cameraMgr.camera
    this.renderer.onResize()

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom)

    this.city = new CityGenerator(this.scene)
    this.physics = new PhysicsWorld()
    this.hud = new HUD(this)

    this.last = performance.now()
    this.running = false
  }

  start(){
    this.city.generate()
    this.physics.init(this.scene)
    this.running = true
    this.loop()
  }

  loop(){
    if(!this.running) return
    const now = performance.now()
    const dt = (now - this.last)/1000
    this.last = now

    this.physics.update(dt)
    this.city.update(dt)
    if(this.player && typeof this.player.update === 'function'){
      this.player.update(dt)
    }

    this.renderer.render(this.scene, this.camera)
    this.stats.update()

    requestAnimationFrame(()=> this.loop())
  }
}
