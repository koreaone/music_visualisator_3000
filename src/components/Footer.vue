<template>
  <v-footer fixed height="70px" class="pa-3 grey darken-3 white--text">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" scrollable max-width="300px">
        <template v-slot:activator="{ on }">
          <v-btn icon dark v-on="on" class="white--text mx-4" id='opendrawbtn'>
            <v-icon>menu</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title><b>Select animation</b></v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-radio-group v-model="anim_1" column>
              <v-radio label="Circles line" value="circle_line"></v-radio>
              <v-radio label="Infinity hole" value="radial_lines"></v-radio>
              <v-radio label="Flower Points" value="radial_points"></v-radio>
              <v-radio label="Flower Shape" value="radial_triangles"></v-radio>
              <v-radio label="Simple Bars" value="simple_bar"></v-radio>
              <v-radio label="Simple Circle" value="simple_circle"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="changeAnimation()">Apply</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="dialog2" max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn icon dark v-on="on" class="white--text mx-4" id='fileinputbtn'>
            <v-icon>get_app</v-icon> 
          </v-btn>
        </template>
        <v-card>
          <v-card-title><b>Input a file</b></v-card-title>
          <v-card-actions>
            <fileinput v-model="file" @input="checkfile"></fileinput>
          </v-card-actions>
          <v-divider></v-divider>
          <v-card flat tile height="300px" width="100%">
            
          </v-card>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" flat @click="dialog2 = false">Close</v-btn>
            <v-btn color="blue darken-1" :disabled="!load_song_ready" flat @click="loadfile">Load</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-btn icon @click.native="SongControl()" class="white--text" id='playbtn'>
      <v-icon>{{ playicon }}</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <div class="progress_bar_div">
      <div style="width:85%">
        <v-progress-linear id="progress_bar" class="" v-model="trackProgress"  @click="setTimeSong($event)"></v-progress-linear>
      </div>
      <div class="ml-3" style="margin-block: auto;">{{ formatTime(seek) }} / {{formatedDuration}}</div> 
    </div>
    <v-spacer></v-spacer>
    <v-btn icon @click.native="muteVolume()" class="white--text mr-2" id='volumebtn'>
      <v-icon >{{ volumeIcon }}</v-icon>
    </v-btn>
    <v-slider class="volumeBar" v-model="volumeFooter" @change="setVolumeFooter()" min="0" max="10" step="1" width="100"></v-slider>
  </v-footer>
</template>
<script>
import fileinput from "./file_input.vue";

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Footer',
  components: {
    fileinput
  },
  data: () => ({
    volumeFooter : 5,
    seek : 0,
    anim_1: 'radial_lines',
    dialog: false,
    dialog2: false,
    file: null,
    load_song_ready : false
  }),
  computed: {
     ...mapGetters({
        playstate : 'getPlaystate',
        playicon : 'getPlayicon',
        volume : 'getSongVolume',
        muted : 'getMutedState',
        seekstore : 'getSongProgress',
        duration : 'getCurrentSongDuratation'
     }),
     volumeIcon(){
       if(this.volumeFooter > 5){
         return "volume_up"
       } else if (this.volumeFooter > 1){
         return "volume_down"
       } else if (this.muted) {
         return "volume_off"
       } else {
         return "volume_mute"
       }
     },
     trackProgress () {
      if (this.duration == 0) return 0
      return (this.seek * 100 )/ this.duration      
    }, 
    formatedDuration(){
      return this.formatTime(this.duration)
    },


  }, 
  watch: {
    volume(newCount, oldCount){
      this.volumeFooter = newCount;
      //console.log("New Volume from store : " + this.volume);
    },
    seekstore(newCount, oldCount){
      if(newCount != 0){
        this.seek = newCount;
      }
      //console.log("seek : " + this.seek + " " + this.duration);
    },
  },
  methods : {
    ...mapActions([
   	 		'toggleDrawer','toggleSong','toggleMute' ,'setVolume', 'setTime', 'setAnim', 'loadFile'
         ]),
    SongControl: function(){
      this.toggleSong();
    },
    setVolumeFooter: function(){
      var payload = {vol : this.volumeFooter }
      console.log("Volume change : " + this.volumeFooter);
      this.setVolume(payload);
    },
    muteVolume: function(){
      this.toggleMute();  
    },
    formatTime: function(time){
      var hours = Math.floor(time / 3600);
      var mins  = Math.floor((time % 3600) / 60);
      var secs  = Math.floor(time % 60);

      if (secs < 10) {
        secs = "0" + secs;
      }

      if (hours) {
        if (mins < 10) {
            mins = "0" + mins;
        }
        return hours + ":" + mins + ":" + secs; // hh:mm:ss
      } else {
        return mins + ":" + secs; // mm:ss
      }
    },
    setTimeSong: function (event){
      let el = document.querySelector("#progress_bar")
      var mousePos = event.offsetX
      var elWidth = el.clientWidth
      var percents = (mousePos / elWidth) * 100
      this.setTime({timecue: percents});
    },
    changeAnimation: function(){
      this.dialog = false;
      this.setAnim({option_1 : this.anim_1});
    },
    checkfile: function(){
      if(this.file.type == 'audio/mpeg'){
        this.load_song_ready = true;
      } else {
        window.alert("File must be an audio file")
        this.file = null;
        this.load_song_ready = false;
        this.dialog2 = false;
      }
    },
    loadfile: function(){
      if(this.load_song_ready){
        var payload = {file: this.file}
        this.loadFile(payload);
        this.dialog2 = false;
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.progress_bar_div {
    width: 100%;
    margin-left: 40px;
    margin-right: 40px;
    display: flex;
}
.v-input__append-outer .v-icon, .v-input__prepend-outer .v-icon{
  color:white
}
  
  .file-select > .select-button {
    padding: 1rem;

    color: white;
    background-color: #2EA169;
  
    text-align: center;
    font-weight: bold;
  }

  .file-select > input[type="file"] {
    display: none;
  }
</style>
