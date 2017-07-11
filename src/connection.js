import socketCluster from 'socketcluster-client'
import { snakeToCamel } from './utils'
import defaultSocketEvents from './defaultSocketEvents'
import Emitter from './emitter'

class Connection {
    constructor(connection) {
        this.connection = socketCluster.connect(connection)
        defaultSocketEvents.map((event) => {
            this.connection.on(event, (payload) => {
                Emitter.emit(connection, event, payload)
            })
        })

        this.connection.on('message', (data) => {
            if(data !== '#1') {
                let payload = JSON.parse(data)
                Emitter.emit(connection, payload.event ? snakeToCamel(payload.event) : 'message', payload.data);
            }
        })
    }
}

export default Connection
