import PF from 'pathfinding'

export default class Pathfinding{
  constructor(width=200, height=200){
    this.grid = new PF.Grid(width, height)
    this.finder = new PF.AStarFinder({allowDiagonal:false})
  }

  findPath(sx, sy, tx, ty){
    const gridBackup = this.grid.clone()
    const path = this.finder.findPath(Math.floor(sx), Math.floor(sy), Math.floor(tx), Math.floor(ty), gridBackup)
    return path.map(p=>({x: p[0], z: p[1]}))
  }
}
