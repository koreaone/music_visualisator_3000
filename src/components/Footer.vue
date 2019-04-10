<template>
  <v-footer fixed height="70px" class="pa-3 grey darken-3 white--text">
    <v-btn icon @click.native="SongControl()" class="white--text" id='playbtn'>
      <v-icon>{{ playicon }}</v-icon>
    </v-btn>
  </v-footer>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Footer',
  data: () => ({
        
  }),
  computed: {
     ...mapGetters({
        playstate : 'getPlaystate',
        playicon : 'getPlayicon'
     })
  },
  methods : {
    ...mapActions([
   	 		'toggleSong'
   			]),
    SongControl: function (){
      this.toggleSong();
    }
  }
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
