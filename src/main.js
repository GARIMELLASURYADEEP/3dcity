import './styles.css'
import Engine from './core/Engine.js'
import Player from './entities/Player.js'

const mount = document.getElementById('app')
const engine = new Engine({ canvas: mount })
// initialize player and attach to engine so engine loop updates it
const player = new Player(engine.camera, engine.renderer.renderer.domElement)
engine.player = player

engine.start()

