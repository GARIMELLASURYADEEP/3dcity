import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const manager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(manager)
const gltfLoader = new GLTFLoader(manager)
const draco = new DRACOLoader()
draco.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(draco)

export default {
  loadTexture: (url)=> new Promise((res,rej)=> textureLoader.load(url,res,undefined,rej)),
  loadGLTF: (url)=> new Promise((res,rej)=> gltfLoader.load(url,res,undefined,rej))
}
