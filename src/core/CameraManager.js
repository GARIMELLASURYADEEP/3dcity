import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

export default class CameraManager{
  constructor(rendererDom){
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000)
    this.camera.position.set(0, 10, 30)

    this.orbit = new OrbitControls(this.camera, rendererDom)
    this.orbit.enabled = true

    this.pointer = new PointerLockControls(this.camera, rendererDom)

    this.mode = 'orbit'
  }

  setMode(mode){
    this.mode = mode
    this.orbit.enabled = (mode==='orbit')
    if(mode==='pointer') this.pointer.lock()
  }
}
