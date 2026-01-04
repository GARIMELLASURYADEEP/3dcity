import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

const MOVE_SPEED = 6
const SPRINT_MULTIPLIER = 1.6
const JUMP_FORCE = 5
const GRAVITY = 25
const PLAYER_HEIGHT = 1.6
const ACCELERATION = 50
const DECELERATION = 20

export default class Player{
  // scene is optional but recommended for proper ground raycasting
  constructor(camera, dom, scene){
    this.camera = camera
    this.dom = dom || document.body
    this.scene = scene || null
    this.controls = new PointerLockControls(camera, this.dom)
    this.enabled = false

    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.moveState = { forward:false, back:false, left:false, right:false, sprint:false }

    this.ground = 0
    this.raycaster = new THREE.Raycaster()

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
    // If scene is provided, use a raycast down to detect ground (works with InstancedMesh too)
    const pos = this.controls.getObject().position
    if(this.scene){
      this.raycaster.set(pos, new THREE.Vector3(0, -1, 0))
      const intersects = this.raycaster.intersectObjects(this.scene.children, true)
      for(let i=0;i<intersects.length;i++){
        const it = intersects[i]
        if(it.distance <= PLAYER_HEIGHT + 0.1) return true
      }
      return false
    }
    // fallback heuristic
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
    const onGround = this.isOnGround()
    if(!onGround){
      this.velocity.y -= GRAVITY * dt
    } else {
      // small snap to ground to avoid floatiness
      this.velocity.y = Math.max(0, this.velocity.y)
    }

    // movement input -> desired velocity
    const input = new THREE.Vector3()
    if(this.moveState.forward) input.z -= 1
    if(this.moveState.back) input.z += 1
    if(this.moveState.left) input.x -= 1
    if(this.moveState.right) input.x += 1

    let targetSpeed = MOVE_SPEED * (this.moveState.sprint ? SPRINT_MULTIPLIER : 1)
    if(input.lengthSq() > 0){
      input.normalize()
      // rotate by camera yaw
      const yaw = new THREE.Euler(0, this.camera.rotation.y, 0, 'YXZ')
      input.applyEuler(yaw)
      input.multiplyScalar(targetSpeed)
    }

    // accelerate / decelerate towards target horizontally
    const horizVel = new THREE.Vector3(this.velocity.x, 0, this.velocity.z)
    const deltaVel = new THREE.Vector3().subVectors(input, horizVel)
    const accel = deltaVel.clone().clampLength(0, ACCELERATION * dt)
    horizVel.add(accel)

    // apply some deceleration when no input
    if(input.lengthSq() === 0){
      horizVel.multiplyScalar(Math.max(0, 1 - DECELERATION * dt / Math.max(1, targetSpeed)))
    }

    this.velocity.x = horizVel.x
    this.velocity.z = horizVel.z

    // apply translation
    this.controls.getObject().position.x += this.velocity.x * dt
    this.controls.getObject().position.z += this.velocity.z * dt

    // apply vertical velocity
    this.controls.getObject().position.y += this.velocity.y * dt

    // ground collision - prevent falling through
    if(this.controls.getObject().position.y < PLAYER_HEIGHT){
      this.velocity.y = 0
      this.controls.getObject().position.y = PLAYER_HEIGHT
    }
  }
}
