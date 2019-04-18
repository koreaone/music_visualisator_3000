
<template>
  <v-app>
    <!--<Navdrawer></Navdrawer>-->
    <Toolbar class="toolbar"></Toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <Snackbar/>
    <Footer></Footer>
  </v-app>
</template>

<script>
import P5 from 'p5'
//import "p5/lib/addons/p5.sound";
import Toolbar from './components/Toolbar'
import Footer from './components/Footer'
import Snackbar from './components/Snackbar'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    Toolbar, Footer, Snackbar
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
  created : function() {
    console.log("App.vue created");
    this.instanciateP5();
    console.log("app.vue p5 instanciated");
  },
  mounted: function () {
    console.log("App.vue mounted")
    //this.instanciateP5()
  }
}
</script>

<style>


</style>
