[Socket cluster](http://socketcluster.io/#!/) implementation for Vuejs 2 leveraging uws

[Socket cluster documentation](http://socketcluster.io/#!/docs)

## Install

``` bash
npm install vue-socket-cluster --save
```

## Usage
#### Configuration
``` js
import VueSocketCluster from 'vue-socket-cluster';
Vue.use(VueSocketCluster, {
      connections: [{
            name: 'echo', // Each connection object must have a name and the name must be unique in the array
            hostname: '127.0.0.1',
            secure: false,
            port: 8000,
            rejectUnauthorized: false
            // Other socket cluster options
      }]
})
```

#### On Vuejs instance usage
add a property ```connection_name+Events``` to listen to connection events
``` js
var vm = new Vue({
      echoEvents:{
            connect: function(){
                console.log('socket connected')
            },
            echo: function(data){
                console.log(data)
            },
            // Other default events such as ['error','connect','disconnect','connectAbort','connecting', ...] as written on the documentation
            error () {
                //An error occurred on the connection name echo
            },
            connecting () {

            },
            // ...
            // for hyphen separated events such as 'custom-error' use ...
            customError () {

            }
      },
      methods: {
            //triggerInstance object = ```connection_name+Client```
            triggerEvent (name, data) {
                this.$echoClient.emit('name', data);
            }
      }
})
```


Remove existing listener on client
``` js
delete this.$options.$echoClient.event_name;
```
##Alternative Usage

```html
<template>
<!--every connection gets a dynamic component
    use <[client-name]-client></[client-name]-client>
    -->
    <echo-client event="echo" :onData="receiveData"></echo-client>
</template>
<script>

  export default {
      methods: {
          receiveData(data) {
              console.log(data)
          }
      }
  }
</script>
```
####default events

```html
<template>
    <!-- bind documented events using :on['Event_name'] first letter being a capital letter -->
    <echo-client event="echo" :onConnect="connected" :onMessage="anyMessageData"></echo-client>
</template>
<script>

  export default {
      methods: {
          connected(){
              console.log('connected to echo socket server')
          },
          anyMessageData(data) {
              console.log(data)
          }
      }
  }
</script>
```

####sending data

```html
<template>
    <!-- send data by changing the data property -->
    <echo-client :onConnect="connected" :data="message"></echo-client>
    <input :value="message" :disabled="connected">
</template>
<script>

  export default {
      data() {
          return {
              connected: false,
              message: null
          }  
      },
      methods: {
          connected(){
              this.connected = true
          },
          anyMessageData(data) {
              console.log(data)
          }
      }
  }
</script>
```
####event data

```html
<template>
    <!-- set the event attribute to the event name -->
    <echo-client event="eventName" :onData="eventData"></echo-client>
</template>
<script>

  export default {
      methods: {
          eventData(data){
             console.log(data)
          }
      }
  }
</script>
```

####subscriptions

```html
<template>

    <!-- set the channel attribute to the channel name -->
    <echo-client channel="channelName" :onData="channelData"></echo-client>
</template>
<script>
  export default {
      methods: {
          channelData(data){
             console.log(data)
          }
      }
  }
</script>
```

Based on works from [MetinSeylan/Vue-Socket.io](https://github.com/MetinSeylan/Vue-Socket.io) and its contributor
