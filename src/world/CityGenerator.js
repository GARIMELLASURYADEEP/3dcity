import * as THREE from 'three'
import BuildingSystem from './BuildingSystem.js'
import RoadSystem from './RoadSystem.js'
import TerrainSystem from './TerrainSystem.js'
import PropsSystem from './PropsSystem.js'
import config from '../config/cityConfig.js'

export default class CityGenerator{
  constructor(scene){
    this.scene = scene
    this.buildings = new BuildingSystem(scene)
    this.roads = new RoadSystem(scene)
    this.terrain = new TerrainSystem(scene)
    this.props = new PropsSystem(scene)
  }

  generate(){
    this.terrain.create()
    this.roads.createGrid()
    this.buildings.createDistricts()
    this.props.populate()
  }

  update(dt){
    this.buildings.update(dt)
    this.props.update(dt)
  }
}
