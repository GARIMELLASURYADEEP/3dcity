import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

const MOVE_SPEED = 6
const SPRINT_MULTIPLIER = 1.6
const JUMP_FORCE = 5
const GRAVITY = 9.8
const PLAYER_HEIGHT = 1.6

export default class Player{
  constructor(camera, dom){
    this.camera = camera
    this.dom = dom || document.body
    this.controls = new PointerLockControls(camera, this.dom)
    this.enabled = false

    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.moveState = { forward:false, back:false, left:false, right:false, sprint:false }

    this.ground = 0

    this.controls.getObject().position.set(0, PLAYER_HEIGHT, 0)

    this.bindEvents()
  }

  bindEvents(){
    this.dom.addEventListener('click', ()=> this.controls.lock())
    this.controls.addEventListener('lock', ()=> this.enabled = true)
    this.controls.addEventListener('unlock', ()=> this.enabled = false)

    window.addEventListener('keydown', (e)=> this.onKey(e, true))
    window.addEventListener('keyup', (e)=> this.onKey(e, false))
  }

  onKey(e, down){
    switch(e.code){
      case 'KeyW': this.moveState.forward = down; break
      case 'KeyS': this.moveState.back = down; break
      case 'KeyA': this.moveState.left = down; break
      case 'KeyD': this.moveState.right = down; break
      case 'ShiftLeft': this.moveState.sprint = down; break
      case 'Space': if(down) this.jump(); break
    }
  }

  isOnGround(){
    // simplified ground check for performance: clamp to PLAYER_HEIGHT as ground
    return this.controls.getObject().position.y <= PLAYER_HEIGHT + 0.05
  }

  jump(){
    if(this.isOnGround()){
      this.velocity.y = JUMP_FORCE
    }
  }

  update(dt){
    if(!this.enabled) return

    // gravity
    this.velocity.y -= GRAVITY * dt

    // movement
    this.direction.set(0,0,0)
    if(this.moveState.forward) this.direction.z -= 1
    if(this.moveState.back) this.direction.z += 1
    if(this.moveState.left) this.direction.x -= 1
    if(this.moveState.right) this.direction.x += 1

    if(this.direction.lengthSq() > 0){
      this.direction.normalize()
      // apply yaw only (camera rotation x is pitch)
      const yaw = new THREE.Euler(0, this.camera.rotation.y, 0, 'YXZ')
      this.direction.applyEuler(yaw)
      const speed = MOVE_SPEED * (this.moveState.sprint ? SPRINT_MULTIPLIER : 1)
      this.controls.getObject().position.addScaledVector(new THREE.Vector3(this.direction.x, 0, this.direction.z), speed * dt)
    }

    // apply vertical velocity
    this.controls.getObject().position.y += this.velocity.y * dt

    // ground collision - prevent falling through
    if(this.controls.getObject().position.y < PLAYER_HEIGHT){
      this.velocity.y = 0
      this.controls.getObject().position.y = PLAYER_HEIGHT
    }
  }
}
