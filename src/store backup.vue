import Vue from 'vue'
import firebase from 'firebase'
import Vuex from 'vuex'
import P5 from 'p5'
import 'p5/lib/addons/p5.sound';
import * as types from './mutation-types'
//import * as animation from './animation'
Vue.use(Vuex)
var config = {
  apiKey: "AIzaSyCImUoNC_TUE7OwlkS99NXDfmBh-u-ItE8",
  authDomain: "music-visualisator-3000.firebaseapp.com",
  databaseURL: "https://music-visualisator-3000.firebaseio.com",
  projectId: "music-visualisator-3000",
  storageBucket: "music-visualisator-3000.appspot.com",
  messagingSenderId: "337144084635"
};
firebase.initializeApp(config);

const state = {
  contact_sent : false,
  drawerState : false,              
  p5Instance : null,                //Defines the object responsible for animation
  isInit : false,
  snackbar_text : "",               //Message of the snackbar
  isLoading : true,
  playicon : 'play_arrow',          //Icon of player 
  volumeScale :  5,                 //Defines current volume 
  muted : false,                    //Defines muted state
  previousVolume : 0,               //If muted, previous volume
  seek : 0,                         //Position of player in current song in seconds
  currentSongDuration : 0,          //Duration of current song in seconds
  anim_choice : 'radialFFT_points_circular',     //Name of current animation
  anim_ready :false,                //Set when animation is ready to be played
  song_ready : false,               //Set when song is ready to be played
  song_mode : 0,                    //Defines song input -- Default is 0 -> from current library -- 1 -> is user input
  wasOnPlay: false,                 //True if when loading song it was playing
  randomPlay : false,               //Defines if play next will do the next or randomly choose a new song
  input_file : null,
  index_library : 0,
  animation_list : [
    {id: 0, name: "Flower Points", value:"radialFFT_points_circular"},
    {id: 1, name: "Flower Shape", value:"radialFFT_triangles_flower"},
    {id: 2, name: "Infinity hole", value:"radialFFT_lines"},
    {id: 3, name: "Infinity Points", value:"radialFFT_points"},
    {id: 4, name: "Infinity Vortex", value:"radialFFT_triangles"},
    {id: 5, name: "Flying Triangles", value:"radialFFT_triangles_rad"},
    {id: 6, name: "Circles line", value:"CircleFFT"},
    {id: 7, name: "Simple Bars", value:"freqBars"},
    {id: 8, name: "Simple Circle", value:"SimpleCircle"},
  ],
  music_library_path : './library/',
  music_library : [
    {id: 0, title:"Childish Gambino - Sweatpants ft. Problem", filename: "Childish Gambino - Sweatpants ft. Problem.mp3"},
    {id: 1, title:"Mome - Aloha", filename: "Mome - Aloha.mp3"},
    {id: 2, title: "Awolation - Sail", filename: "Awolation - Sail.mp3"},
    {id: 3, title: "Cage The Elephant - Come A Little Closer", filename: "Cage The Elephant - Come A Little Closer.mp3"},
    {id: 4, title: "Drake - Back to Back", filename: "Drake - Back to Back.mp3"}, 
    {id: 5, title: "Hemaera - Pure Happiness 2", filename: "Hemaera - Pure Happiness 2.wav"}, 
    {id: 6, title: "The Kooks - Naive", filename: "The Kooks - Naive.mp3"}, 
    {id: 7, title: "The Blaze - Virile", filename: "The Blaze - Virile.mp3"},
    {id: 8, title: "The XX - Intro", filename: "The XX - Intro.mp3"},
    {id: 9, title: "Two Feet - Love Is A Bitch", filename: "Two Feet - Love Is A Bitch.mp3"},
    {id: 10, title: "Hans Zimmer - Interstellar", filename: "Hans Zimmer - Interstellar.mp3"},
    {id: 11, title: "PLK - Pas les mêmes", filename: "PLK - Pas les mêmes.mp3"},
    {id: 12, title: "Yellow Claw - No Class (Jordi Rivera Remix)", filename: "Yellow Claw - No Class (Jordi Rivera Remix).mp3"},
    {id: 13, title: "AREA21 - Spaceships", filename: "AREA21 - Spaceships.mp3"},
    {id: 14, title: "Lil Peep - Star Shopping", filename: "Lil Peep - Star Shopping.mp3"},
    {id: 15, title: "Mac DeMarco - My Kind Of Woman", filename: "Mac DeMarco - My Kind Of Woman.mp3"},
    
  ]
}
const mutations = {
  [types.TOGGLE_SONG] (state){
    console.log("Mutation TOGGLE_SONG")
    state.p5Instance.toggleSong();
  },
  [types.PLAY_NEXT] (state){
    console.log("Mutation TOGGLE_SONG")
    state.p5Instance.playNext();
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
  [types.SET_ANIM] (state, { option_1
   }){
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
       var colors=['#4c00c7', '#c70039', '#FF5733', '#00c760', '#00c717', '#0056c7', '#c70059', '#03ccc7'];
      var A = 0, B = 2, C = 3, D = 4;
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
          p.launchAnim();
        }
        if(state.wasOnPlay){
          p.playMusic();
        }
        state.snackbar_text = "Sound has loaded"
      }

      p.onErrorLoad = function(){
        state.snackbar_text = "mamamia something wrong happened";
      } 

      p.songIsOver = function(){
        //p.playNext();
        console.log("song is over")
      }

      p.loadSong = function(){
        state.song_ready = false;
        state.seek = 0;
        if(song && song.isPlaying()){
          p.pauseMusic();
          state.wasOnPlay = true;
        } else {
          state.wasOnPlay = false;
        }
        if(state.anim_ready){
          p.stopAnim();
        }
        if(state.song_mode == 0){
          song = p.loadSound(state.music_library_path + state.music_library[state.index_library].filename, p.onStartLoad, p.onErrorLoad, null);
          console.log("Now loading "+ state.music_library[state.index_library].filename);
          state.snackbar_text = "Now loading "+ state.music_library[state.index_library].filename;
        } else if (state.song_mode == 1){
          song = p.loadSound(state.input_file, p.onStartLoad, p.onErrorLoad, null);
          console.log("Now load user file :" + state.input_file.name);
          state.snackbar_text = "Now loading "+ state.input_file.name;
        }
        //song.onended(p.songIsOver());
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

      //P5 MousePressed
      p.mouseClicked = function() {
        if (p.mouseX > 0 && p.mouseX < width && p.mouseY > 0 && p.mouseY < height) {
          let l = colors.length;
          A = (A+1)%l;
          B = (B+1)%l;
          C = (C+1)%l;
          D = (D+1)%l;
        }
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
      p.playNext = function(){
        state.song_mode = 0;
        if(state.randomPlay){
          let rdm = generateRandom(0, state.music_library.length-1);
          state.index_library = rdm;
        } else {
          let max = state.music_library.length-1;
          if(state.index_library == max){
            state.index_library = 0;
          } else {
            state.index_library += 1;
          }
        }
        p.loadSong();
        if(!state.wasOnPlay){
          p.playMusic();
        }
          
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
          case 'SimpleCircle':
            p.setAngleDegree();
            break;
          case 'TrapNation':
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
        //If loaded on page animation or not
        if(document.getElementById("anim-holder") != null){
          p.resetHeight();
          p.createCanvas(width, height);
        } else {
          p.createCanvas(200, 200);
          p.noLoop();
        }
        //Set song on pause & set volume toc0.5
        song.stop();
        song.setVolume(volume);

        //Setting up song analysers
        amplitude = new P5.Amplitude();
        FFT = new P5.FFT(0.9, 128);
        console.log("P5 Setup Done");
        state.anim_ready = true;
      }

      //P5 Draw
      p.draw = function () {
        if(DoAnimation){
          levels = amplitude.getLevel();
          spectrum = FFT.analyze();
          p.background(0)
          eval("state.p5Instance."+ state.anim_choice +"()");
        }
      }

      //Animation line of frequencies with circles
      p.CircleFFT = function(){
        p.noFill();
        p.strokeWeight(levels * 4);
        p.stroke(255);
        for(var i = 0; i < spectrum.length; i+=2){
          var x = p.map(i, 0, spectrum.length, 0, width);
          var r = p.map(spectrum[i], 0, 255, 0, 400);
          p.ellipse(x, height/2, r, r);
          p.ellipse(x, height/2, r * 0.66, r * 0.66);
          p.ellipse(x, height/2, r * 0.33, r * 0.33);
        }
      }
      
      var count1 = 0;
      var count2 = 0;
      p.radialFFT_lines = function(){
        p.noFill();
        p.translate(width / 2, height / 2);
        var maxRadius = (width/2);
        p.radialFigure_lines(maxRadius, 0 + count1, colors[A]);
        p.radialFigure_lines(maxRadius * 0.7, 60 - count2,  colors[B]);
        p.radialFigure_lines(maxRadius * 0.4, 120 + count2, colors[C]);
        p.radialFigure_lines(maxRadius * 0.1, 180 - count1, colors[D]);
        count1+=0.003;
        count2+=0.002;
        if(count1 > 1){
          count1 = 0;
        }
        if(count2 > 1){
          count2 = 0;
        }
      }

      p.radialFFT_points_circular = function(){
        p.noFill();
        p.translate(width / 2, height / 2);
        p.strokeWeight(3.2);
        var maxRadius = (0.9)*(width/2);
        p.radialFigure_points(maxRadius, count1, colors[A]);
        p.radialFigure_points(maxRadius * 0.8, 120 - count1, colors[B]);
        p.radialFigure_points(maxRadius * 0.6, 180 + count1, colors[C]);
        p.radialFigure_points(maxRadius * 0.4, 270 - count1, colors[D]);
        count1+= 0.005;
      }

      p.radialFFT_points = function(){
        p.noFill();
        p.translate(width / 2, height / 2);
        p.strokeWeight(3.2);
        p.radialFigure_points(320, 0, colors[A]);
        p.radialFigure_points(260, 0,  colors[B]);
        p.radialFigure_points(200, 0, colors[C]);
        p.radialFigure_points(140, 0, colors[D]);
        
      }

      p.radialFFT_triangles = function(){
        //p.noFill();
        p.translate(width / 2, height / 2);
        var maxRadius = (0.8)*(width/2);
        p.radialFigure_triangles(maxRadius, 0 + count1, colors[A], 255);
        p.radialFigure_triangles(maxRadius * 0.8, 60 - count2,  colors[B], 220);
        p.radialFigure_triangles(maxRadius * 0.5, 120 + count2, colors[C], 190);
        p.radialFigure_triangles(maxRadius * 0.3, 180 - count1, colors[D], 160);
        count1+=0.003;
        count2+=0.002;
        if(count1 > 1){
          count1 = 0;
        }
        if(count2 > 1){
          count2 = 0;
        }
      }

      p.radialFFT_triangles_rad = function(){
        //p.noFill();
        p.translate(width / 2, height / 2);
        var maxRadius = (0.8)*(width/2);
        p.radialFigure_triangles_rad(maxRadius, 0 + count1, colors[A], 255);
        p.radialFigure_triangles_rad(maxRadius * 0.8, 60 - count2,  colors[B], 220);
        p.radialFigure_triangles_rad(maxRadius * 0.5, 120 + count2, colors[C], 190);
        p.radialFigure_triangles_rad(maxRadius * 0.3, 180 - count1, colors[D], 160);
        count1+=0.003;
        count2+=0.002;
        if(count1 > 1){
          count1 = 0;
        }
        if(count2 > 1){
          count2 = 0;
        }
      }

      p.radialFFT_triangles_flower = function(){
        //p.noFill();
        p.translate(width / 2, height / 2);
        p.radialFigure_triangles_flower(320, 0 + count1, colors[A], 255);
        p.radialFigure_triangles_flower(260, 60 - count2,  colors[B], 220);
        p.radialFigure_triangles_flower(200, 120 + count2, colors[C], 190);
        p.radialFigure_triangles_flower(140, 180 - count1, colors[D], 160);
        count1+=0.003;
        count2+=0.002;
        if(count1 > 1){
          count1 = 0;
        }
        if(count2 > 1){
          count2 = 0;
        }
      }

      p.radialFigure_lines = function(maxRadius, offset, hexColor){
        p.stroke(hexColor);
        p.strokeWeight(levels * 3.5 + 1);
        p.beginShape();
        var minRadius =50*levels
        maxRadius+=50*levels
        for (var i = 0; i < spectrum.length-1; i+=1) {
          var angle = p.map(i, 0, spectrum.length, 0, 350 + Math.sin(offset) * 20 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, 256, minRadius, maxRadius);
          var x = r * Math.cos(angle + offset);
          var y = r * Math.sin(angle + offset);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.radialFigure_points = function(maxRadius, offset, hexColor){
        p.stroke(hexColor);
        p.beginShape(p.POINTS);
        var minRadius = 0;
        for (var i = 0; i < spectrum.length-1; i+=2) {
          var angle = p.map(i, 0, spectrum.length, 0, 350+ Math.sin(offset) * 7 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, 255, minRadius + 50 * levels, maxRadius + 50 * levels);
          //var r = p.map(amp, 0, 256, minRadius, maxRadius);
          var x = r * Math.cos(angle + offset);
          var y = r * Math.sin(angle + offset);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.radialFigure_triangles = function(maxRadius, offset, hexColor, grey){
        p.stroke(hexColor);
        p.strokeWeight(2);
        p.fill(grey * levels)
        p.beginShape(p.TRIANGLES);
        var minRadius =50*levels
        maxRadius+=50*levels
        for (var i = 0; i < spectrum.length-1; i+=1) {
          var angle = p.map(i, 0, spectrum.length, 0, 300 + Math.sin(offset) * 7 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, 255, minRadius, maxRadius);
          var x = r * Math.cos(angle + offset);
          var y = r * Math.sin(angle + offset);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.radialFigure_triangles_flower = function(maxRadius, offset, hexColor, grey){
        p.stroke(hexColor);
        p.strokeWeight(2);
        p.fill(190 * levels)
        p.beginShape(p.TRIANGLES);
        var minRadius =50*levels
        maxRadius+=50*levels
        for (var i = 0; i < spectrum.length-1; i+=2) {
          var angle = p.map(i, 0, spectrum.length, 0, 300 + p.sin(offset) * 7 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, 128, minRadius, maxRadius);
          //var r = p.map(amp, 0, 256, minRadius, maxRadius);
          var x = r * p.cos(angle + offset);
          var y = r * p.sin(angle + offset);
          p.vertex(x, y);
        }
        p.endShape();
}

      p.radialFigure_triangles_rad = function(maxRadius, offset, hexColor, grey){
        p.stroke(hexColor);
        p.strokeWeight(2);
        p.fill(grey * levels)
        p.beginShape(p.TRIANGLES);
        var minRadius =50*levels
        maxRadius+=50*levels
        for (var i = 0; i < spectrum.length-1; i+=1) {
          var angle = p.map(i, 0, spectrum.length, 0, 2*Math.PI + Math.sin(offset) * 7 );
          var amp = spectrum[i];
          var r = p.map(amp, 0, 255, minRadius, maxRadius);
          var x = r * Math.cos(angle + offset);
          var y = r * Math.sin(angle + offset);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.TrapNation = function(){
        p.noStroke();
        
        p.translate(width / 2, height / 2);
        var minradius = 100;
        p.TrapNation_sub(minradius, 150, '#00c760', 0);
        p.TrapNation_sub(minradius, 130, '#c70039', 0);
        p.TrapNation_sub(minradius, 120, '#4c00c7', 0);
        p.fill(255)
        p.ellipse(0, 0, minradius, minradius);
      }

      p.TrapNation_sub = function(minradius, radius, color, offset){
        p.fill(color)
        p.beginShape();
        for (var i = 0; i < spectrum.length; i+=1) {
          var angle = p.map(i, 0, spectrum.length, 0, 360) + offset;
          var amp = spectrum[i];
          
          var r = p.map(amp, 0, 255, 0, radius);
          var x = r * p.cos(angle);
          var y = r * p.sin(angle);
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
          var r = p.map(amp, 0, 255, 20, 300 + levels * 400);
          var x = r * p.cos(angle);
          var y = r * p.sin(angle);
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.freqBars = function(){
        p.fill(colors[A]);
        p.stroke(colors[A]);
        p.strokeWeight(1);
        var zeroo = false;
        for(var i = 0; i < spectrum.length; i++){
            var x = p.map(i, 0, spectrum.length, 0,width);
            if(!zeroo && spectrum[i] == 0 ){
              console.log(x + " "+ i)
              zeroo = true;
            }
            var h = -height + p.map(spectrum[i], 0, 255, height , 0.4 * height);
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
      getPlayicon : state => state.playicon,
      getSongVolume : state => state.volumeScale,
      getMutedState : state => state.muted,
      getCurrentSongDuratation : state => state.currentSongDuration,
      getSongProgress : state => state.seek,
      getAnimready : state => state.anim_ready,
      getSongready : state => state.song_ready,
      getSongMode : state => state.song_mode,
      getIndexLibrary: state => state.index_library,
      getMusicLibrary: state => state.music_library,
      getRandomState: state => state.randomPlay,
      getAnimationList: state => state.animation_list
}

const actions = {
      instanciateP5({ commit, state}){
        if(state.p5Instance == null){
          commit(types.INSTANCIATE_P5)
        } else {
          console.log("ERROR p5Instanciate : p5instance already exists")
        }
        
      },
      startAnimation({commit}){
        console.log("action triggered - launch anim");
        commit(types.LAUNCH_ANIMATION)
      },
      stopAnimation({commit}){
        console.log("action triggered - stop anim");
        commit(types.STOP_ANIMATION)
      },
      toggleDrawer({commit}){
        commit(types.TOGGLE_DRAWER)
      },
      toggleSong({commit}){
        commit(types.TOGGLE_SONG)
      },
      playNext({commit}){
        commit(types.PLAY_NEXT)
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
      setRandom({state}){
        state.randomPlay = !state.randomPlay;
      },
      sendMessage({state}, payload){
        if(state.contact_sent){
          state.snackbar_text = "Only one message is allowed per session"
        }
        let now = new Date();
            let time = "" + now.getDay() + "/" + now.getMonth() + "/" + now.getFullYear() + " - " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            //state.userinfo = userinfo;
            
            var messagesRef = firebase.database().ref('messages');
            var newMessageRef = messagesRef.push();
            newMessageRef.set({
                name: payload.name,
                email: payload.email,
                object: payload.object,
                message: payload.message,
                time: time
            });
            state.snackbar_text = "Message has been sent ! Thanks"
      //  var promise = Vue.http.get('http://cors-anywhere.herokuapp.com/http://api.ipstack.com/115.91.214.2?access_key=518e4a70542dacfe3f6f00d6d9770946'
      //   ).then(function ({data}) {
      //       var userinfo = {};
      //       userinfo.ip = data.ip;
      //       userinfo.city = data.city;
      //       userinfo.country_name = data.country_name;

            
      //   })
        
      },
      countVisitor(){

      },
      
}

function generateRandom(min, max) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return (num === playingindex) ? generateRandom(min, max) : num;
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})