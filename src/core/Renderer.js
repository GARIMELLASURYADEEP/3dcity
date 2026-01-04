import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export default class Renderer {
  constructor({canvas}){
    this.renderer = new THREE.WebGLRenderer({antialias:true})
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // reduce shadow map size for performance
    this.renderer.shadowMapWidth = 1024
    this.renderer.shadowMapHeight = 1024
    canvas.appendChild(this.renderer.domElement)

    this.composer = new EffectComposer(this.renderer)
    this.renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera())
    this.composer.addPass(this.renderPass)
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.6, 0.4, 0.1))

    window.addEventListener('resize', ()=> this.onResize())
  }

  onResize(){
    const w = window.innerWidth, h = window.innerHeight
    this.renderer.setSize(w,h)
    this.composer.setSize(w,h)
  }

  render(scene, camera){
    // ensure renderPass uses current scene and camera
    this.renderPass.scene = scene
    this.renderPass.camera = camera
    this.composer.render()
  }
}
