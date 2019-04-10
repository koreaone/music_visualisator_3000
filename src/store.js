import Vue from 'vue'
import Vuex from 'vuex'
import P5 from 'p5'
import 'p5/lib/addons/p5.sound';
import * as types from './mutation-types'

Vue.use(Vuex)


const state = {
  p5Instance : null,
  isInit : false,
  playstate: false,
  playicon : 'play_arrow'
}


const mutations = {
  [types.OPEN_DRAWER] (state){
    state.drawerState = !state.drawerState
    console.log(state.drawerState)
  },
  [types.TOGGLE_SONG] (state){
    console.log("Mutation TOGGLE_SONG")
    state.p5Instance.toggleSong();
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
      //Global variables
      let song;
      var songReady = false;
      var FFT, amplitude, peakDetector;
      var height, width;
      var levels = 0, spectrum = []
      var DoAnimation = false;
      var volume = 0.5;
      var binCount = 256;

      //Get the new height and width
      p.resetHeight = function(){
        width = document.getElementById("anim-holder").clientWidth;
        height = document.getElementById("anim-holder").clientHeight  - 70;
      }

      p.preload = function(){
        console.log("P5 Preload")
        song = p.loadSound('./Cage The Elephant - Come A Little Closer.mp3')
        if(song.isLoaded()){

        }
      }

      //Start the animation
      p.launchAnim = function (){
        console.log("in p5 : launch anim")
        p.resetHeight();
        p.resizeCanvas(width, height);
        DoAnimation = true;
        p.loop()
      }

      //Stop the animation
      p.stopAnim = function (){
        DoAnimation = false;
        p.noLoop()
      }

      
      //P5 Keypressed
      p.keyPressed = function() {
        if (p.keyCode === p.ENTER) {
          p.toggleSong();
        } else if(p.keyCode === p.UP_ARROW){
          p.volumeUp();
        } else if(p.keyCode === p.DOWN_ARROW){
          p.volumeDown();
        }
      }

      //P5 Windows resized
      p.windowResized= function () {
        console.log("Window resized")
        p.resetHeight();
        p.resizeCanvas(width, height);
      }

      p.toggleSong = function(){
        if(song.isPlaying()){
          p.pauseMusic();
        } else {
          p.playMusic();
        }
      }

      //Play music
      p.playMusic = function () {
        console.log("P5 Play song")
        if(song.isLoaded()){
          song.play();
          state.playstate = true;
          state.playicon = 'pause'
        }
      }
      
      //Pause Music
      p.pauseMusic = function () {
        console.log("P5 Pause song")
        if(song.isLoaded()){
          song.pause();
          state.playstate = false;
          state.playicon = 'play_arrow'
        }
      }

      p.volumeUp = function(){
        console.log("P5 Volume Up");
        if(volume != 1){
          volume += 0.1; 
        }
        song.setVolume(volume);
      }

      p.volumeDown = function(){
        console.log("P5 Volume Down");
        if(volume != 0){
          volume -= 0.1;
        }
        song.setVolume(volume);
        
      }


      //P5 Setup
      p.setup = function () {
        console.log("P5 Setup Start")

        //If loaded on page /animation or not
        if(document.getElementById("anim-holder") != null){
          console.log("1")
          p.resetHeight();
          p.createCanvas(width, height);
        } else {
          console.log("2");
          p.createCanvas(200, 200);
          p.noLoop();
        }
        
        //Set song on pause
        song.stop();
        state.playstate = false;

        //Set volume
        song.setVolume(volume);

        //Setting up song analysers
        amplitude = new P5.Amplitude();
        FFT = new P5.FFT(0.9, binCount);
        console.log("P5 Setup Done")

        //p.angleMode(p.DEGREES)
      }

      //P5 Draw
      p.draw = function () {
        if(DoAnimation){
          p.background(0);
          levels = amplitude.getLevel();
          spectrum = FFT.analyze();
          //p.CircleFFT();
          p.radialFFT();
        }
      }

      
      //Animation line of frequencies with circles
      p.CircleFFT = function(){
        p.noFill()
        //p.map(levels, 0, 1, 3, 7)
        p.strokeWeight(levels * 4);
        var levelScale = p.map(levels, 0, 1, 1, 10);
        for(var i = 0; i < spectrum.length; i+=2){
          var red = (p.map(spectrum[i], 0, 256, 1, 255) + p.random(-50, 50)) % 255;
          var green = (p.map(spectrum[i], 0, 256, 1, 255) + p.random(-50, 50)) % 255;
          var blue = (p.map(spectrum[i], 0, 256, 1, 255) + p.random(-50, 50)) % 255;
          p.stroke(red, green, blue);
          var x = p.map(i, 0, spectrum.length, 0, width);
          var r = p.map(spectrum[i], 0, binCount, 0, 200);
          p.ellipse(x, height/2, r, r);
          p.ellipse(x, height/2, r * 0.66, r * 0.66);
          p.ellipse(x, height/2, r * 0.33, r * 0.33);
        }
      }
      
      var count1 = 0;
      var count2 = 0;
      var count3 = 0;
      var count4 = 0;
      var count5 = 0;
      p.radialFFT = function(){
        //p.stroke(255);
        //p.noStroke();
        p.noFill();
        p.translate(width / 2, height / 2);
        p.radialFigure(320, 0 + count1, '#4c00c7');
        p.radialFigure(260, 60 - count2,  '#c70039');
        p.radialFigure(200, 120 + count3, '#FF5733');
        p.radialFigure(140, 180 - count4, '#00c760');
        //p.radialFigure(80, 240 + count5, '#4c00c7');
        count1+=0.003;
        count2+=0.002;
        count3+=0.002;
        count4+=0.003;
        count5+=0.002;
        if(count1 > 360){
          count1 = 0;
        }
        if(count2 > 360){
          count2 = 0;
        }
        if(count3 > 360){
          count3 = 0;
        }
        if(count4 > 360){
          count4 = 0;
        }
        if(count5 > 360){
          count5 = 0;
        }
      }

      p.radialFigure = function(maxRadius, offset, hexColor){
        p.stroke(hexColor);
        p.strokeWeight(levels * 3.5 + 2.5);
        //p.fill(255)
        p.beginShape(p.POINTS);
        var minRadius = 0;
        for (var i = 0; i < spectrum.length-1; i+=2) {
          var angle = p.map(i, 0, spectrum.length, 0, 360 + p.sin(offset * 5 ) * 7 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, binCount, minRadius + 50 * levels, maxRadius * 2);
          //var r = p.map(amp, 0, 256, minRadius, maxRadius);
          var x = r * p.cos(angle + offset);
          var y = r * p.sin(angle + offset);
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
            var h = -height + p.map(spectrum[i], 0, binCount, height , 0.2 * height);
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
      getPlaystate : state => state.playstate,
      getPlayicon : state => state.playicon
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
      toggleSong({commit, state}){
        commit(types.TOGGLE_SONG)
      }

}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})