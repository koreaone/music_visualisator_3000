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
  [types.LAUNCH_ANIMATION] (state){
    console.log("Mutation LAUNCH_ANIMATION")
    state.p5Instance.launchAnim();
  },
  [types.STOP_ANIMATION] (state){
    console.log("Mutation STOP_ANIMATION")
    state.p5Instance.stopAnim();
  },
  [types.INSTANCIATE_P5](state){
    var sketch = function (p) {
      let song;
      var FFT, amplitude, peakDetector;
      var height, width;
      var levels = 0, spectrum = []
      var DoAnimation = false;

      p.resetHeight = function(){
        width = document.getElementById("anim-holder").clientWidth;
        height = document.getElementById("anim-holder").clientHeight  - 70;
      }

      p.preload = function(){
        console.log("P5 Preload")
        song = p.loadSound('./Cage The Elephant - Come A Little Closer.mp3')

      }

      p.launchAnim = function (){
        console.log("in p5 : launch anim")
        p.resetHeight();
        p.resizeCanvas(width, height);
        DoAnimation = true;
        p.loop()
      }

      p.stopAnim = function (){
        DoAnimation = false;
        p.noLoop()
      }

      p.setup = function () {
        console.log("P5 Setup Start")
        if(document.getElementById("anim-holder") != null){
          console.log("1")
          p.resetHeight();
          p.createCanvas(width, height);
        } else {
          console.log("2");
          p.createCanvas(200, 200);
          p.noLoop();
        }
        
        song.stop()
        state.playstate = false;
        //p.angleMode(p.DEGREES);
        amplitude = new P5.Amplitude();
        //amplitude.setInput(song);
        //peakDetector = new P5.PeakDetect();
        FFT = new P5.FFT(0.9, 128);
        console.log("P5 Setup Done")
      }


      p.draw = function () {
        if(DoAnimation){
          p.background(0);
          levels = amplitude.getLevel();
          spectrum = FFT.analyze();
          p.CircleFFT();
        }
        
        
      }

      p.windowResized= function () {
        console.log("Window resized")
        p.resetHeight();
        p.resizeCanvas(width, height);
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

      p.CircleFFT = function(){
        p.noFill()
        var scaleLevel = p.map(levels, 0, 1, 0, 255);
        for(var i = 0; i < spectrum.length; i+=2){
          p.stroke(p.random(127, scaleLevel), p.random(127, scaleLevel),p.random(127, scaleLevel), scaleLevel);
          //p.strokeWeight(p.map(spectrum[i], 0, spectrum.length, 1, 5));
          var x = p.map(i, 0, spectrum.length, 0, width);
          var r = p.map(spectrum[i], 0, 256, 5, 110);
          p.ellipse(x, height/2, r, r);
        }
        // for(var j = 1; j < spectrum.length; j+=2){
        //   p.stroke(p.random(120, 255));
        //   var x = p.map(j, 0, spectrum.length, 0,width);
        //   var r = p.map(spectrum[j], 0, 256, 0, 100);
        //   p.ellipse(x, height/2, r, r);
        // }
      }
      
      p.radialFFT = function(){
        p.stroke(255);
        //p.noStroke();
        p.translate(width / 2, height / 2);
        p.beginShape();
        var minRadius = p.map(levels, 0, 1, 0, 60)
        for (var i = 0; i < spectrum.length; i++) {
          var angle = p.map(i, 0, spectrum.length, 0, 360);
          var amp = spectrum[i];
          var r = p.map(amp, 0, 256, minRadius, 100);
          var x = r * p.cos(angle);
          var y = r * p.sin(angle);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.freqBars = function(){
        p.fill('rgba(199,0,57,0.8)');
        p.stroke('rgba(199,0,57,0.8)');
        p.strokeWeight(1);

        for(var i = 0; i < spectrum.length; i++){
            var x = p.map(i, 0, spectrum.length, 0,width);
            var h = -height + p.map(spectrum[i], 0, 255, height , 0.2 * height);
            p.rect(x, height, (width / spectrum.length) , h )
        }
      }

      p.drawWaveform = function(){
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

      p.levelBackground = function(){
        p.background(p.map(levels, 0, 1, 0, 255));
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
      startAnimation({commit, state}){
        console.log("action triggered - launch anim");
        commit(types.LAUNCH_ANIMATION)
      },
      stopAnimation({commit, state}){
        console.log("action triggered - stop anim");
        commit(types.STOP_ANIMATION)
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