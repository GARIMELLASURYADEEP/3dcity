import * as THREE from 'three'

export default class Minimap{
  constructor(renderer, scene){
    this.renderer = renderer
    this.scene = scene
    this.size = 256
    this.rt = new THREE.WebGLRenderTarget(this.size, this.size)
    this.camera = new THREE.OrthographicCamera(-500,500,500,-500,0.1,2000)
    this.camera.position.set(0,500,0)
    this.camera.lookAt(0,0,0)
  }

  render(){
    this.renderer.setRenderTarget(this.rt)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setRenderTarget(null)
  }
}
