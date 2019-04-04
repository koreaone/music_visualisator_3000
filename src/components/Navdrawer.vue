<template>
  <v-navigation-drawer app clipped permanent width="200" :value="drawer" class="grey lighten-4 pb-0" >
    <p>navbar</p>

  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Navdrawer',
  computed: mapGetters({
    	drawer: 'drawerState',
		}),
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
