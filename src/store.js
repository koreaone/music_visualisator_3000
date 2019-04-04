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
      let FFT;
      var analyser;
      let dropzone;
      let playButton;

      p.preload = function(){
        console.log("P5 Preload")
        song = p.loadSound('./Awolation - Sail.mp3')

      }

      p.setup = function () {
        console.log("P5 Setup")

        p.createCanvas(document.getElementById("anim-holder").clientWidth, document.getElementById("anim-holder").clientHeight - 70);
        p.angleMode(P5.DEGREES)
        song.stop()
        state.playstate = false;


        analyser = new P5.Amplitude();
        FFT = new P5.FFT(0.9, 64);
        
      }


      let i = 0;
      let j = 80;
      p.draw = function () {
        //bgcolor = Color(51, 0, i % 255)
        p.background(255)
        i +=1;
        j += 2;
        p.fill((100 + i )% 255, (29 + j)% 255, 47)
        p.ellipse(p.width / 2, p.height / 2, 100, 100)
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