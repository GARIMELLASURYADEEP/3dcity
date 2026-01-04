import * as THREE from 'three'

const loader = new THREE.TextureLoader()

const files = {
  building1: '/building1.png',
  building2: '/building2.png',
  building3: '/building3.png',
  building4: '/building4.png',
  road: '/road.png'
}

function prepare(tex){
  tex.encoding = THREE.sRGBEncoding
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = Math.min(16, rendererMaxAnisotropy())
  tex.needsUpdate = true
  return tex
}

function rendererMaxAnisotropy(){
  try{ const canvas = document.createElement('canvas'); const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'); const ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic'); return ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1 }catch(e){ return 1 }
}

const buildingTextures = []
const buildingMaterials = []
let roadTexture = null
let roadMaterial = null

function loadTextures(){
  const bnames = ['building1','building2','building3','building4']
  bnames.forEach(name=>{
    const tex = loader.load(files[name])
    prepare(tex)
    buildingTextures.push(tex)
  })
  roadTexture = loader.load(files.road)
  prepare(roadTexture)

  buildingTextures.forEach(tex=>{
    tex.repeat.set(1, 4)
    const mat = new THREE.MeshStandardMaterial({map: tex, roughness: 0.8, metalness: 0.05})
    buildingMaterials.push(mat)
  })

  roadTexture.repeat.set(8, 1)
  roadTexture.needsUpdate = true

  roadMaterial = new THREE.MeshStandardMaterial({map: roadTexture, roughness: 0.6, metalness: 0.02})
}

loadTextures()

export default {
  buildingTextures,
  buildingMaterials,
  roadTexture,
  roadMaterial,
  getBuildingMaterial: (index)=> buildingMaterials[index % buildingMaterials.length]
}
