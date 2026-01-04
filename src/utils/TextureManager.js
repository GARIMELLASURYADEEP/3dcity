import * as THREE from 'three'

const loader = new THREE.TextureLoader()

// Files are in the project's public/ root so they resolve at '/building1.png' etc.
const files = {
  building1: '/building1.png',
  building2: '/building2.png',
  building3: '/building3.png',
  building4: '/building4.png',
  road: '/road.png'
}

function rendererMaxAnisotropy(){
  try{
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const ext = gl && (gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic'))
    return ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1
  }catch(e){ return 1 }
}

function prepare(tex){
  tex.encoding = THREE.sRGBEncoding
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = Math.min(16, rendererMaxAnisotropy())
  tex.needsUpdate = true
  return tex
}

const buildingTextures = []
const materialCache = new Map() // key: `${texIdx}_${repeatY}` -> material
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
  // sensible default tiling for roads (will be adjusted by systems)
  roadTexture.repeat.set(8, 1)
  roadTexture.needsUpdate = true

  // create a default road material
  roadMaterial = new THREE.MeshStandardMaterial({map: roadTexture, roughness: 0.6, metalness: 0.02})
}

loadTextures()

function getBuildingMaterial(texIndex, verticalRepeat = 4){
  const idx = texIndex % buildingTextures.length
  const key = `${idx}_${Math.round(verticalRepeat*100)/100}`
  if(materialCache.has(key)) return materialCache.get(key)

  const baseTex = buildingTextures[idx]
  // We reuse the same texture object but change repeat on the texture copy used by the material.
  // To avoid modifying the shared texture repeat (which would affect other materials),
  // create a lightweight clone of the texture object that references the same image.
  const tex = baseTex.clone()
  tex.repeat = baseTex.repeat.clone()
  tex.repeat.set(1, verticalRepeat)
  tex.needsUpdate = true

  const mat = new THREE.MeshStandardMaterial({map: tex, roughness: 0.8, metalness: 0.05})
  mat.map = tex
  mat.map.encoding = THREE.sRGBEncoding
  mat.map.wrapS = THREE.RepeatWrapping
  mat.map.wrapT = THREE.RepeatWrapping
  mat.map.anisotropy = Math.min(16, rendererMaxAnisotropy())

  materialCache.set(key, mat)
  return mat
}

function getRoadMaterial(){
  return roadMaterial
}

export default {
  buildingTextures,
  getBuildingMaterial,
  getRoadMaterial,
  roadTexture,
  roadMaterial
}
