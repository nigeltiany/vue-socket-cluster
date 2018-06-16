import { normalizeConnectionHooks } from './utils'

class Emitter {

    constructor() {
        this.connections = new Map();
    }

    addEventSource(connection) {
        this.connections.set(normalizeConnectionHooks(connection), new Map())
    }

    addListener(connection, event, callback, vm) {
        if(typeof callback === 'function'){
            this.connections.get(normalizeConnectionHooks(connection)).set(event, {callback: callback, vm: vm});
            return true
        }

        return false
    }

    removeListener(connection, event, callback, vm) {
        let normalizedConnectionHook = normalizeConnectionHooks(connection)
        let sourceExists = this.connections.has(normalizedConnectionHook)

        if (sourceExists) {
          if (this.connections.get(normalizedConnectionHook).has(event)) {
            return false
          }
          this.connections.get(normalizedConnectionHook).delete(event)
          return true
        }
        return false;
    }


  emit(connection, event, ...args) {
        let normalizedConnectionHook = normalizeConnectionHooks(connection)
        let sourceExists = this.connections.has(normalizedConnectionHook)
        let listenerExists = false

        if (!sourceExists) {
          return false
        } else {
          listenerExists = this.connections.get(normalizedConnectionHook).has(event);
        }

        if (listenerExists) {
            let listener = this.connections.get(normalizedConnectionHook).get(event)

            listener.callback.call(listener.vm, ...args)
            return true;
        }

        return false;
    }

}

export default new Emitter
