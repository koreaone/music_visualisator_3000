<template>
  <v-footer app fixed height="70px" class="pa-3 grey darken-3 white--text">
    <v-btn icon dark  @click="dialog = true" class="white--text" id='opendrawbtn'>
        <v-icon>tune</v-icon>
    </v-btn>
    <v-btn icon dark @click="dialog2 = true" class="white--text" id='fileinputbtn'>
      <v-icon>library_music</v-icon> 
    </v-btn>
    <v-btn icon @click.native="SongControl()" :disabled="!songready" class="white--text" id='playbtn'>
      <v-icon>{{ playicon }}</v-icon>
    </v-btn>
    <v-btn icon @click.native="PlayNext()" class="white--text" id='nextbtn'>
      <v-icon>skip_next</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <div class="progress_bar_div">
      <v-layout row justify-center align-center fill-height>
        <v-flex xs9>
          <v-progress-linear id="progress_bar" :indeterminate="!songready" v-model="trackProgress"  @click="setTimeSong($event)"></v-progress-linear>
        </v-flex>
        <v-flex xs3>
          <div class="ml-3" style="margin-block: auto;">{{ formatTime(seek) }} / {{formatedDuration}}</div> 
        </v-flex>
      </v-layout>      
    </div>
    <v-btn icon @click.native="SetRandomMode()" :class="{'blue--text': isRandom, 'white--text': !isRandom}" id='playbtn'>
      <v-icon>shuffle</v-icon>
    </v-btn>
    <v-btn icon @click.native="muteVolume()" class="white--text mr-2" id='volumebtn'>
      <v-icon >{{ volumeIcon }}</v-icon>
    </v-btn>
    <v-slider class="volumeBar" v-model="volumeFooter" @change="setVolumeFooter()" min="0" max="10" step="1" width="100"></v-slider>
    
    <v-layout row justify-center>
      <v-dialog v-model="dialog" scrollable max-width="300px">
        <v-card>
          <v-card-title><b>Select animation</b></v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-radio-group v-model="anim_1" column>
              <v-radio v-for="item in anim_list" :key="item.id" :label="item.name" :value="item.value"></v-radio>
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
      <v-dialog v-model="dialog2" width="600">
        <v-card>
          <v-card-title><b>Choose your own file !</b></v-card-title>
          <v-card-actions>
            <fileinput v-model="file" @input="checkfile" class="px-3"></fileinput>
          </v-card-actions>
          <v-divider></v-divider>
          
          <v-card flat tile width="100%">
            <v-card-title><b>Choose from our library !</b></v-card-title>
            <v-select v-model="librarysong_selected" :items="musiclibrary" label="Pick a song !" outline class="px-4"  item-value="id" item-text="title" :change="SetNewChoice()"></v-select>
          </v-card>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="red darken-1" flat @click="closeDialog2">Close</v-btn>
            <v-btn color="green darken-1" :disabled="!loadFile_ok" flat @click="loadfile">Load</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
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
    anim_1: 'radialFFT_points_circular',
    dialog: false,
    dialog2: false,
    file: null,
    checkFile_ok : false,
    loadFile_ok : false,
    librarysong_selected : 0
  }),
  computed: {
     ...mapGetters({
        playicon : 'getPlayicon',
        volume : 'getSongVolume',
        muted : 'getMutedState',
        seekstore : 'getSongProgress',
        duration : 'getCurrentSongDuratation',
        songmode : 'getSongMode',
        indexlibrary: 'getIndexLibrary',
        musiclibrary : 'getMusicLibrary',
        songready : 'getSongready',
        isRandom : 'getRandomState',
        anim_list : 'getAnimationList'
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
    }
  }, 
  watch: {
    volume(newCount, oldCount){
      this.volumeFooter = newCount;
    },
    seekstore(newCount, oldCount){
      if(newCount != 0){
        this.seek = newCount;
      }
    },
  },
  methods : {
    ...mapActions([
   	 		'toggleDrawer','toggleSong','toggleMute' ,'setVolume', 'setTime', 'setAnim', 'loadFile','loadFromLibrary','setSnackbar', 'playNext', 'setRandom'
         ]),
    SongControl: function(){
      this.toggleSong();
    },
    PlayNext: function(){
      console.log("Play next")
      this.playNext();
    },
    SetRandomMode: function(){
      this.setRandom();
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
      console.log(this.anim_1
      )
      this.setAnim({option_1 : this.anim_1});
    },
    checkfile: function(){
      this.librarysong_selected = -1;
      console.log(this.file.type)
      if(this.file.type == 'audio/mpeg' || this.file.type == 'audio/mp3' || this.file.type == 'audio/wav'){
        this.checkFile_ok = true;
        this.loadFile_ok = true;
        console.log("File :");
        console.log(this.file);
      } else {
        this.setSnackbar({text :"File must be an audio file"});
        this.file = null;
        this.checkFile_ok = false;
        this.loadFile_ok = false;
        this.dialog2 = false;
      }
    },
    closeDialog2(){
      this.dialog2 = false;
      this.librarysong_selected = this.indexlibrary;
    },
    SetNewChoice(){
      if(this.librarysong_selected != -1){
        this.file = null;
        this.checkFile_ok = false;
        this.loadFile_ok = true;
      }
      
    },
    loadfile: function(){
      if(this.checkFile_ok){
        var payload = {file: this.file}
        this.loadFile(payload);
      } else if (this.librarysong_selected != -1){
        console.log("Loading new song from library :"+ this.musiclibrary[this.librarysong_selected].title);
        this.loadFromLibrary({id: this.librarysong_selected});
      }
      this.closeDialog2();
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
