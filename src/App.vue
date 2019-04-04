
<template>
  <v-app>
    <!--<Navdrawer></Navdrawer>-->
    <Toolbar class="toolbar"></Toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer app></Footer>
  </v-app>
</template>

<script>
import P5 from 'p5'
import "p5/lib/addons/p5.sound";
import Toolbar from './components/Toolbar'
import Footer from './components/Footer'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    Toolbar, Footer
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions([
   	 		'instanciateP5'
   			]),
  },
  mounted: function () {
    console.log(P5)
    this.instanciateP5()
  }
}
</script>

<style>


</style>
