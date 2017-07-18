<template></template>
<script>
    export default {
        name: 'socket-component',
        props: {
            event: {
                type: String,
                required: false
            },
            channel: {
                type: String,
                required: false
            },
            onMessage: {
                type: Function,
                required: false
            },
            onDeauthenticate: {
                type: Function,
                required: false
            },
            onAuthenticate: {
                type: Function,
                required: false
            },
            onSubscribeRequest: {
                type: Function,
                required: false
            },
            onSubscribeStateChange: {
                type: Function,
                required: false
            },
            onAuthTokenChange: {
                type: Function,
                required: false
            },
            onAuthStateChange: {
                type: Function,
                required: false
            },
            onUnsubscribe: {
                type: Function,
                required: false
            },
            onSubscribeFail: {
                type: Function,
                required: false
            },
            onSubscribe: {
                type: Function,
                required: false
            },
            onKickOut: {
                type: Function,
                required: false
            },
            onRaw: {
                type: Function,
                required: false
            },
            onConnectAbort: {
                type: Function,
                required: false
            },
            onDisconnect: {
                type: Function,
                required: false
            },
            onConnect: {
                type: Function,
                required: false
            },
            onConnecting: {
                type: Function,
                required: false
            },
            onError: {
                type: Function,
                required: false
            },
            onDropOut: {
                type: Function,
                required: false
            },
            onData: {
                type: Function,
                required: false
            },
            data: {
                type: [String, Array, Object, Boolean, Number],
                required: false
            }
        },
        __setSocketClientName__(socketClientName) {
            this.socketClientName = socketClientName
        },
        mounted () {
            this.socket = this[this.constructor.options.socketClientName]
            if(this.event || this.channel) {
                if (typeof this.onConnect === 'function') {
                    this.socket.on(this.event, this.onConnect)
                }
                if (typeof this.onDisconnect === 'function') {
                    this.socket.on(this.event, this.onDisconnect)
                }
                if (typeof this.onConnectAbort === 'function') {
                    this.socket.on(this.event, this.onConnectAbort)
                }
                if (typeof this.onConnecting === 'function') {
                    this.socket.on(this.event, this.onConnecting)
                }
                if (typeof this.onRaw === 'function') {
                    this.socket.on(this.event, this.onRaw)
                }
                if (typeof this.onKickOut === 'function') {
                    this.socket.on(this.event, this.onKickOut)
                }
                if (typeof this.onSubscribe === 'function') {
                    this.socket.on(this.event, this.onSubscribe)
                }
                if (typeof this.onSubscribeFail === 'function') {
                    this.socket.on(this.event, this.onSubscribeFail)
                }
                if (typeof this.onUnsubscribe === 'function') {
                    this.socket.on(this.event, this.onUnsubscribe)
                }
                if (typeof this.onAuthStateChange === 'function') {
                    this.socket.on(this.event, this.onAuthStateChange)
                }
                if (typeof this.onAuthTokenChange === 'function') {
                    this.socket.on(this.event, this.onAuthTokenChange)
                }
                if (typeof this.onSubscribeStateChange === 'function') {
                    this.socket.on(this.event, this.onSubscribeStateChange)
                }
                if (typeof this.onSubscribeRequest === 'function') {
                    this.socket.on(this.event, this.onSubscribeRequest)
                }
                if (typeof this.onAuthenticate === 'function') {
                    this.socket.on(this.event, this.onAuthenticate)
                }
                if (typeof this.onDeauthenticate === 'function') {
                    this.socket.on(this.event, this.onDeauthenticate)
                }
                if (typeof this.onMessage === 'function') {
                    this.socket.on(this.event, this.onMessage)
                }
                if (typeof this.onData === 'function') {
                    this.socket.on(this.event, this.onData)
                }
                if (this.channel) {
                    this.socket.subscribe(this.channel)
                    this.socket.watch(this.channel, this.onData)
                }
            }else {
                throw new Error('The event or channel attribute must be set. Set the event attribute to listen for a socket event. Set the channel attribute to subscribe to a socket channel')
            }
        },

        methods: {
            unsubscribe () {
                if (this.channel) {
                    this.socket.unsubscribe(this.channel)
                }
                else {
                    throw new Error('No channel to unsubscribe to, is the channel property set?')
                }
            }
        },
        watch: {
            data () {
                this.socket.emit((this.event || this.channel), this.data)
            }
        }
    }
</script>
