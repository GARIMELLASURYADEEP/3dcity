import * as THREE from 'three'

export default class SceneManager{
  constructor(){
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xa0c8ff)
    this.scene.fog = new THREE.FogExp2(0xa0c8ff, 0.0006)

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
    hemi.position.set(0,200,0)
    this.scene.add(hemi)

    const sun = new THREE.DirectionalLight(0xffffff, 1.0)
    sun.position.set(100,200,100)
    sun.castShadow = true
    sun.shadow.camera.left = -200
    sun.shadow.camera.right = 200
    sun.shadow.camera.top = 200
    sun.shadow.camera.bottom = -200
    sun.shadow.mapSize.set(2048,2048)
    this.scene.add(sun)
    this.sun = sun
  }
}
