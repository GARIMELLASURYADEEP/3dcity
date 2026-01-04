export default class EventBus {
  constructor() { this.map = new Map() }
  on(k, cb) { if (!this.map.has(k)) this.map.set(k, []); this.map.get(k).push(cb) }
  off(k, cb) { if (!this.map.has(k)) return; this.map.set(k, this.map.get(k).filter(f=>f!==cb)) }
  emit(k, ...a) { (this.map.get(k)||[]).forEach(f=>f(...a)) }
}
