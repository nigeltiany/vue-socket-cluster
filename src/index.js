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

                    let normalizedName = normalizeConnectionEvents(connection)
                    let connectionHook = this.$options[normalizedName]

                    this.$options[normalizedName] = new Proxy({}, {
                        set: (target, key, value) => {
                            Emitter.addListener(connection, key, value, this)
                            target[key] = value
                            return true;
                        },
                        deleteProperty: (target, key) => {
                            Emitter.removeListener(connection, key, this.$options[normalizedName][key], this)
                            delete target.key;
                            return true
                        }
                    })

                    if(connectionHook) {
                        Object.keys(connectionHook).forEach((eventHook) => {
                            this.$options[normalizedName][eventHook] = connectionHook[eventHook];
                        });
                    }
                })
            },
            beforeDestroy(){
                options.connections.map((connection) => {
                    let nomalizedName = normalizeConnectionEvents(connection)
                    let connectionHook = this.$options[nomalizedName]

                    if(connectionHook){
                        Object.keys(connectionHook).forEach((eventHook) => {
                            delete this.$options[nomalizedName][eventHook]
                        });
                    }
                })
            }
        })
    }
}
