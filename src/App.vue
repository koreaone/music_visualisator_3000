
<template>
  <v-app>
    <Toolbar app ></Toolbar>

    <v-content>
      <HelloWorld/>
    </v-content>
    <Footer app></Footer>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import Navdrawer from './components/Navdrawer'
import Toolbar from './components/Toolbar'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    HelloWorld, Navdrawer, Toolbar, Footer
  },
  data () {
    return {
      //
    }
  }
}
</script>

