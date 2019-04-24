<template>
  <v-toolbar id="toolbar" color="grey darken-3" app fixed clipped-left>                   
    <v-toolbar-title class="white--text">
    <v-btn flat to="/" class="white--text" active-class style="font-size: 20px;">
         Music Visualisator 3000  
    </v-btn>                                       
    </v-toolbar-title>                             
    <v-spacer></v-spacer>                          
    <v-toolbar-items >  
      <v-btn flat to="/animation" class="white--text">
         <v-icon>details</v-icon>
         <span class="ml-1">Animation</span>
      </v-btn> 
      <v-btn flat to="/about" class="white--text">
         <v-icon>info</v-icon>
         <span class="ml-1">About</span>
      </v-btn>                  
    </v-toolbar-items> 
  </v-toolbar>    
</template>

<script>
import { mapGetters, mapActions } from 'vuex'


export default {
  name: 'Toolbar',
  methods: {
    ...mapActions([
   	 		'openDrawer'
   			]),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#toolbar{
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
}
</style>
