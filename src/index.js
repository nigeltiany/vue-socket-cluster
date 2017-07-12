import Connection from './connection'
import Emitter from './emitter'
import { normalizeConnectionClient, normalizeConnectionEvents } from './utils'
import SocketComponent from './SocketComponent.vue'

export default {

    install(Vue, options = {
        connections: []
    }) {
        let seen = new Set();
        let hasDuplicates = options.connections.some(function(connection) {
            return seen.size === seen.add(connection.name).size || !connection.name;
        });

        if(hasDuplicates) {
            throw new Error('Duplicate or null socket connection name found')
        }

        if(options.connections.length === 0) {
            return
        }

        options.connections.map((connection) => {
            Vue.prototype[`$${normalizeConnectionClient(connection)}`] = new Connection(connection).connection
            let component = SocketComponent
            component.__setSocketClientName__(`$${normalizeConnectionClient(connection)}`)
            Vue.component(normalizeConnectionClient(connection), component)
        })

        Vue.mixin({
            created(){
                options.connections.map((connection) => {
                    Emitter.addEventSource(connection)

                    let connectionHook = this.$options[normalizeConnectionEvents(connection)]

                    this.$options[connectionHook] = new Proxy({}, {
                        set: (target, key, value) => {
                            Emitter.addEventHook(connection, key, value, this)
                            target[key] = value
                            return true;
                        },
                        deleteProperty: (target, key) => {
                            Emitter.removeListener(connection, key, this.$options[connectionHook][key], this)
                            delete target.key;
                            return true
                        }
                    })

                    if(connectionHook) {
                        Object.keys(connectionHook).forEach((eventHook) => {
                            this.$options[connectionHook][eventHook] = connectionHook[eventHook];
                        });
                    }
                })
            },
            beforeDestroy(){
                options.connections.map((connection) => {
                    let connectionHook = this.$options[normalizeConnectionEvents(connection)]
                    if(connectionHook){
                        Object.keys(connectionHook).forEach((eventHook) => {
                            delete this.$options[connectionHook][eventHook]
                        });
                    }
                })
            }
        })
    }
}