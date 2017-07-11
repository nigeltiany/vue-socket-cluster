import { normalizeConnectionHooks } from './utils'

class Emitter {

    constructor() {
        this.connections = new Map();
    }

    addEventSource(connection) {
        this.connections[normalizeConnectionHooks(connection)] = new Map()
    }

    addEventHook(connection, event, callback, vm) {
        if(typeof callback === 'function'){
            this.connections.has(connection.name+event) ||
                this.connections.set(connection.name+event, []);
            this.connections.get(connection.name+event).push({callback: callback, vm: vm});
            return true
        }

        return false
    }

    removeListener(connection, event, callback, vm) {
        let events = this.connections.get(connection.name+event),
            index;

        if (events && events.length) {
            index = events.reduce((i, event, index) => {
                return (typeof event.callback === 'function' && event.callback === callback && event.vm === vm) ?
                    i = index :
                    i;
            }, -1);

            if (index > -1) {
                events.splice(index, 1);
                this.events.set(connection.name+event, events);
                return true;
            }
        }
        return false;
    }


  emit(connection, event, ...args) {
        let hooks = this.connections.get(connection.name+event);
        //console.log(...args)
        if (hooks && hooks.length) {
            hooks.forEach((hook) => {
                hook.callback.call(hook.vm, ...args)
            });
            return true;
        }
        return false;
    }

}

export default new Emitter
