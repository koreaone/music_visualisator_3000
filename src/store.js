import Vue from 'vue'
import Vuex from 'vuex'
import P5 from 'p5'
import 'p5/lib/addons/p5.sound';
import * as types from './mutation-types'

Vue.use(Vuex)


const state = {
  p5Instance : null,
  isInit : false,
  playstate: false
}


const mutations = {
  [types.OPEN_DRAWER] (state){
    state.drawerState = !state.drawerState
    console.log(state.drawerState)
  },
  [types.PLAY_SONG] (state){
    console.log("Mutation play_song")
    state.p5Instance.playMusic();
  },
  [types.PAUSE_SONG] (state){
    console.log("Mutation stop_song")
    state.p5Instance.pauseMusic();
  },
  [types.INSTANCIATE_P5](state){
    var sketch = function (p) {
      let song;
      var FFT, amplitude, peakDetector;
      var height;
      var width;

      p.preload = function(){
        console.log("P5 Preload")
        song = p.loadSound('./Cage The Elephant - Come A Little Closer.mp3')

      }


      p.setup = function () {
        console.log("P5 Setup")
        width = document.getElementById("anim-holder").clientWidth;
        height = document.getElementById("anim-holder").clientHeight  - 70;
        p.createCanvas(width, height);
        song.stop()
        state.playstate = false;

        amplitude = new P5.Amplitude();
        //amplitude.setInput(song);
        peakDetector = new P5.PeakDetect();
        FFT = new P5.FFT(0.9, 64);
        
      }


      let i = 0;
      let j = 80;
      let h = 120;
      var levels = 0;
      var spectrum = []
      p.draw = function () {
        
        levels = amplitude.getLevel();
        spectrum = FFT.analyze();
        peakDetector.update(FFT);
        p.background(p.map(levels, 0, 1, 0, 255));
        
        
        
        p.fill('rgba(199,0,57,0.8)');
        p.stroke('rgba(199,0,57,0.8)');
        p.strokeWeight(1);

        for(var i = 0; i < spectrum.length; i++){
            var x = p.map(i, 0, spectrum.length, 0,width);
            var h = -height + p.map(spectrum[i], 0, 255, height , 0.2 * height);
            p.rect(x, height, (width / spectrum.length) , h )
        }

        var waveform = FFT.waveform();
        p.noFill();
        p.beginShape();

        p.stroke(255,255,255); // waveform is white
        p.strokeWeight(1);
        for (var i = 0; i< waveform.length; i+=5){
            var x = p.map(i, 0, waveform.length, 0, width);
            var y = p.map( waveform[i]/5, -1, 1, 0, height);
            p.vertex(x,y);
        }
        p.endShape();


      }

      p.windowResized= function () {
        p.resizeCanvas(document.getElementById("anim-holder").clientWidth, document.getElementById("anim-holder").clientHeight);
      }

      
      p.playMusic = function () {
        console.log("P5 Play song")
        song.play();
        state.playstate = true;
      }
      
      p.pauseMusic = function () {
        console.log("P5 Pause song")
        song.pause();
        state.playstate = false;
      }
      
      p.normalCircle = function (){
        
      }

    }
    state.p5Instance = new P5(sketch, "anime" );
    state.isInit = true;
  }
}

const getters = {
      Getp5Instance : state => state.p5Instance,
      IsInit : state => state.isInit,
      getPlaystate : state => state.playstate
}


const actions = {
      openDrawer({ commit, state}){
        commit(types.OPEN_DRAWER)
      },
      instanciateP5({ commit, state}){
        if(state.p5Instance == null){
          commit(types.INSTANCIATE_P5)
        } else {
          console.log("ERROR p5Instanciate : p5instance already exists")
        }
        
      },
      playSong({commit, state}){
        commit(types.PLAY_SONG)
      },
      pauseSong({commit, state}){
        commit(types.PAUSE_SONG)
      }

}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})