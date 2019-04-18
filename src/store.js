import Vue from 'vue'
import Vuex from 'vuex'
import P5 from 'p5'
import 'p5/lib/addons/p5.sound';
import * as types from './mutation-types'

Vue.use(Vuex)


const state = {
  drawerState : false,              
  p5Instance : null,                //Defines the object responsible for animation
  isInit : false,
  snackbar_text : "",               //Message of the snackbar
  isLoading : true,
  playstate: false,                 //Defines if player is in play mode  --UNUSED
  pausestate : false,               //Defines if player is in pause mode  -- UNUSED
  playicon : 'play_arrow',          //Icon of player 
  volumeScale :  5,                 //Defines current volume 
  muted : false,                    //Defines muted state
  previousVolume : 0,               //If muted, previous volume
  seek : 0,                         //Position of player in current song in seconds
  currentSongDuration : 0,          //Duration of current song in seconds
  anim_choice : 'radial_lines',     //Name of current animation
  anim_ready :false,                //Set when animation is ready to be played
  song_ready : false,               //Set when song is ready to be played
  song_mode : 0,                    //Defines song input -- Default is 0 -> from current library -- 1 -> is user input
  input_file : null,
  index_library : 0,
  music_library : [
    {id: 0, title:"Damso -  Macarena.mp3", filename: "Damso -  Macarena.mp3"},
    {id: 1, title:"Mome - Aloha", filename: "Mome - Aloha.mp3"},
    {id: 2, title: "Awolation - Sail", filename: "Awolation - Sail.mp3"},
    {id: 3, title: "Cage The Elephant - Come A Little Closer", filename: "Cage The Elephant - Come A Little Closer.mp3"} 
  ]
}

const mutations = {
  [types.TOGGLE_DRAWER] (state){
    console.log("Mutation TOGGLE_DRAWER")
    state.drawerState = !state.drawerState
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
  [types.SET_VOLUME] (state, { newvol }){
    console.log("Mutation SET_VOLUME")
    state.volumeScale = newvol;
    if(state.muted){
      state.muted = false;
    }
    state.p5Instance.setSongVolume();
  },
  [types.SET_TIME_SONG] (state, { timeCue }){
    console.log("Mutation SET_TIME_SONG " + timeCue)
    state.p5Instance.jumpMusic(timeCue);
  },
  [types.LOAD_FILE] (state, {file}){
    state.input_file = file;
    state.index_library = -1;
    state.song_mode = 1;
    state.p5Instance.loadSong();
  },
  [types.LOAD_LOCAL_FILE] (state, {id}){
    console.log("Index :", + id)
    state.index_library = id;
    state.song_mode = 0;
    state.p5Instance.loadSong();
  },
  [types.SET_MUTED] (state){
    console.log("Mutation SET_MUTED")
      if(!state.muted){
        state.previousVolume = state.volumeScale;
        state.volumeScale = 0;
        state.muted = true;
      } else {
        state.volumeScale = state.previousVolume;
        state.muted = false;
      }
      state.p5Instance.setSongVolume();
  },
  [types.SET_ANIM] (state, { option_1 }){
    console.log("Mutation SET_ANIM " + option_1)
    state.anim_choice = option_1;
    state.p5Instance.setAnimationParameters();
  },
  [types.INSTANCIATE_P5](state){
    var sketch = function (p) {
       //Global variables
       let song;
       var FFT, amplitude, peakDetector;
       var height, width;
       var levels = 0, spectrum = []
       var DoAnimation = false;
       var volume = 0.5;
       let updateSeek;
       
       var binCount = 128;
      //Get the new height and width
      p.resetHeight = function(){
        width = document.getElementById("anim-holder").clientWidth;
        height = document.getElementById("anim-holder").clientHeight;
      }

      p.onStartLoad = function(){
        console.log("Sound loaded")
        p.setSongInfo()
        state.seek = 0.1;
        state.song_ready = true;
        if(state.anim_ready){
          p.launchAnim()
        }
        state.snackbar_text = "Sound has loaded"
      }

      p.onErrorLoad = function(){
        state.snackbar_text = "mamamia something wrong happened";
      } 

      p.loadSong = function(){
        state.song_ready = false;
        state.seek = 0;
        if(song){
          p.pauseMusic();
        }
        if(state.anim_ready){
          p.stopAnim();
        }
        if(state.song_mode == 0){
          song = p.loadSound('./' + state.music_library[state.index_library].filename, p.onStartLoad, p.onErrorLoad, null);
          console.log("Now loading "+ state.music_library[state.index_library].filename);
          state.snackbar_text = "Now loading "+ state.music_library[state.index_library].filename;
        } else if (state.song_mode == 1){
          song = p.loadSound(state.input_file, p.onStartLoad, p.onErrorLoad, null);
          console.log("Now load user file :" + state.input_file.name);
          state.snackbar_text = "Now loading "+ state.input_file.name;
        }

      }

      p.preload = function(){
        console.log("P5 Preload")
        p.loadSong();
        
      }

      //Start the animation
      p.launchAnim = function (){
        //console.log("Launching animation")
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
          state.seek = song.currentTime();
          updateSeek = setInterval(() => {
            var t = song.currentTime();
            if(t != 0){
              state.seek = t;
            }
          }, 250)
          state.pausestate = false;
          state.playicon = 'pause'
        }
      }
      
      //Pause Music
      p.pauseMusic = function () {
        console.log("P5 Pause song")
        if(song.isLoaded()){
          clearInterval(updateSeek)
          song.pause();
          state.pausestate = true;
          state.playicon = 'play_arrow'
        }
      }

      p.jumpMusic = function (timeCue){
        console.log("P5 Jump song to " + timeCue);
        if(state.song_ready == true){
          p.stopAnim();
          song.jump((song.duration() / 100) * timeCue);
          p.launchAnim();
        } else {
          console.log("jumpmusic : Audio file is not ready yet")
        }
        
      }

      p.setSongVolume = function(){
        volume = state.volumeScale/10
        song.setVolume(volume);
        console.log("Store : volume " + volume)
      }

      p.volumeUp = function(){
        console.log("P5 Volume Up");
        if(state.volumeScale < 10){
          state.volumeScale += 1; 
        }
        p.setSongVolume();
      }

      p.volumeDown = function(){
        console.log("P5 Volume Down");
        if(state.volumeScale > 0){
          state.volumeScale -= 1;
        }
        p.setSongVolume();
      }

      p.setSongInfo = function(){
        state.currentSongDuration = song.duration();
      }

      p.setAngleDegree = function(){
        p.angleMode(p.DEGREES);
      }

      p.setAngleRadiant = function(){
        p.angleMode(p.RADIANS);
      }

      p.setAnimationParameters = function(){
        switch(state.anim_choice){
          case 'simple_circle':
            p.setAngleDegree();
            break;
          default:
            p.setAngleRadiant();
            break;
        }
      }

      //P5 Setup
      p.setup = function () {
        console.log("P5 Setup Start")
        p.frameRate(30);
        //If loaded on page /animation or not
        if(document.getElementById("anim-holder") != null){
          p.resetHeight();
          p.createCanvas(width, height);
        } else {
          p.createCanvas(200, 200);
          p.noLoop();
        }

        if(song.isLoaded()){
          state.currentSongDuration = song.duration()
        }

        //Set song on pause
        song.stop();
        state.playstate = false;
        p.setSongInfo();
        //Set volume
        song.setVolume(volume);
        //Setting up song analysers
        amplitude = new P5.Amplitude();
        FFT = new P5.FFT(0.9, binCount);
        console.log("P5 Setup Done");
        state.anim_ready = true;
      }

      //P5 Draw
      p.draw = function () {
        if(DoAnimation){
          p.background(0)
          levels = amplitude.getLevel();
          spectrum = FFT.analyze();

          switch(state.anim_choice){
            case 'radial_lines':
              p.radialFFT_lines();
              break;
            case 'circle_line':
              p.CircleFFT();
              break;
            case 'radial_points':
              p.radialFFT_points();
              break;
            case 'radial_triangles':
              p.radialFFT_triangles();
              break;
            case 'simple_bar':
              p.freqBars();
              break;
            case 'simple_circle':
              p.SimpleCircle();
              break;
            default:
              break;
          }
        }
      }

      //Animation line of frequencies with circles
      p.CircleFFT = function(){
        p.noFill();
        p.strokeWeight(levels * 4);
        var levelScale = p.map(levels, 0, 1, 1, 10);
        for(var i = 0; i < spectrum.length; i+=2){
          var red = (p.map(spectrum[i], 0, 256, 1, 255) ) ;
          var green = (p.map(spectrum[i], 0, 256, 1, 255) ) ;
          var blue = (p.map(spectrum[i], 0, 256, 1, 255) ) ;
          p.stroke(red, green, blue);
          var x = p.map(i, 0, spectrum.length, 0, width);
          var r = p.map(spectrum[i], 0, binCount, 0, 400);
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
      p.radialFFT_lines = function(){
        p.noFill();
        p.translate(width / 2, height / 2);
        p.radialFigure_lines(400, 0 + count1, '#4c00c7');
        p.radialFigure_lines(300, 60 - count2,  '#c70039');
        p.radialFigure_lines(200, 120 + count3, '#FF5733');
        p.radialFigure_lines(100, 180 - count4, '#00c760');
        //p.radialFigure(80, 240 + count5, '#4c00c7');
        count1+=0.003;
        count2+=0.002;
        count3+=0.002;
        count4+=0.003;
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
      }

      p.radialFFT_points = function(){
        //p.stroke(255);
        //p.noStroke();
        p.noFill();
        p.translate(width / 2, height / 2);
        p.radialFigure_points(320, 0 + count1, '#4c00c7', 255);
        p.radialFigure_points(260, 60 - count2,  '#c70039', 220);
        p.radialFigure_points(200, 120 + count3, '#FF5733', 190);
        p.radialFigure_points(140, 180 - count4, '#00c760', 160);
        //p.radialFigure(80, 240 + count5, '#4c00c7');
        count1+=0.003;
        count2+=0.002;
        count3+=0.002;
        count4+=0.003;
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
      }

      p.radialFFT_triangles = function(){
        //p.stroke(255);
        //p.noStroke();
        p.noFill();
        p.translate(width / 2, height / 2);
        p.radialFigure_triangles(320, 0 + count1, '#4c00c7', 255);
        p.radialFigure_triangles(260, 60 - count2,  '#c70039', 220);
        p.radialFigure_triangles(200, 120 + count3, '#FF5733', 190);
        p.radialFigure_triangles(140, 180 - count4, '#00c760', 160);
        //p.radialFigure(80, 240 + count5, '#4c00c7');
        count1+=0.003;
        count2+=0.002;
        count3+=0.002;
        count4+=0.003;
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
      }

      p.radialFigure_lines = function(maxRadius, offset, hexColor){
        p.stroke(hexColor);
        p.strokeWeight(levels * 3.5 + 1);
        p.beginShape();
        var minRadius = 0;
        for (var i = 0; i < spectrum.length-1; i+=2) {
          var angle = p.map(i, 0, spectrum.length, 0, 300 + p.sin(offset) * 7 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, 256, minRadius + 50 * levels, maxRadius + 50 * levels);
          var x = r * p.cos(angle + offset);
          var y = r * p.sin(angle + offset);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.radialFigure_points = function(maxRadius, offset, hexColor, grey){
        p.stroke(hexColor);
        p.strokeWeight(3);
        p.beginShape(p.POINTS);
        var minRadius = 0;
        for (var i = 0; i < spectrum.length-1; i+=2) {
          var angle = p.map(i, 0, spectrum.length, 0, 300 + p.sin(offset) * 7 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, binCount, minRadius + 50 * levels, maxRadius + 50 * levels);
          //var r = p.map(amp, 0, 256, minRadius, maxRadius);
          var x = r * p.cos(angle + offset);
          var y = r * p.sin(angle + offset);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.radialFigure_triangles = function(maxRadius, offset, hexColor, grey){
        p.stroke(hexColor);
        p.strokeWeight(levels * 3.5);
        p.fill(grey * levels)
        p.beginShape(p.TRIANGLES);
        var minRadius = 0;
        for (var i = 0; i < spectrum.length-1; i+=2) {
          var angle = p.map(i, 0, spectrum.length, 0, 300 + p.sin(offset) * 7 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, binCount, minRadius + 50 * levels, maxRadius + 50 * levels);
          //var r = p.map(amp, 0, 256, minRadius, maxRadius);
          var x = r * p.cos(angle + offset);
          var y = r * p.sin(angle + offset);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.SimpleCircle = function(){
        p.noStroke();
        p.fill(255)
        p.translate(width / 2, height / 2);
        p.beginShape();
        for (var i = 0; i < spectrum.length; i+=1) {
          var angle = p.map(i, 0, spectrum.length, 0, 360 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, 256, 20, 300 + levels * 400);
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
            var h = -height + p.map(spectrum[i], 0, binCount, height , 0.4 * height);
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
    state.p5Instance = new P5(sketch, "anime");
    state.isInit = true;
  }
}

const getters = {
      GetDrawerstate : state => state.drawerState,
      Getp5Instance : state => state.p5Instance,
      IsInit : state => state.isInit,
      getSnackbarText: state => state.snackbar_text,
      getPlaystate : state => state.playstate,
      getPausestate : state => state.pausestate,
      getPlayicon : state => state.playicon,
      getSongVolume : state => state.volumeScale,
      getMutedState : state => state.muted,
      getCurrentSongDuratation : state => state.currentSongDuration,
      getSongProgress : state => state.seek,
      getAnimready : state => state.anim_ready,
      getSongready : state => state.song_ready,
      getSongMode : state => state.song_mode,
      getIndexLibrary: state => state.index_library,
      getMusicLibrary: state => state.music_library
}


const actions = {
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
      toggleDrawer({commit, state}){
        commit(types.TOGGLE_DRAWER)
      },
      toggleSong({commit, state}){
        commit(types.TOGGLE_SONG)
      },
      setVolume({commit}, payload){
        var newvol = payload.vol;
        commit(types.SET_VOLUME, {newvol})
      },
      toggleMute({commit}){
        commit(types.SET_MUTED)
      },
      loadFile({commit}, payload){
        var file = payload.file
        commit(types.LOAD_FILE, {file})
      },
      loadFromLibrary({commit}, payload){
        var id = payload.id
        commit(types.LOAD_LOCAL_FILE, {id})
      },
      setTime({commit}, payload){
        var timeCue = payload.timecue
        commit(types.SET_TIME_SONG, {timeCue})
      },
      setAnim({commit}, payload){
        var option_1 = payload.option_1
        commit(types.SET_ANIM, {option_1})
      },
      setSnackbar({state}, payload){
        state.snackbar_text = payload.text;
      },


}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})