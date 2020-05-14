import state from "./store";
import P5 from "p5";
import "p5/lib/addons/p5.sound";

let sketch = function(p) {
  //Global variables
  let song;
  var FFT, amplitude, peakDetector;
  var height, width;
  var levels = 0,
    spectrum = [];
  var DoAnimation = false;
  var volume = 0.5;
  let updateSeek;
  var colors = [
    "#4c00c7",
    "#c70039",
    "#FF5733",
    "#00c760",
    "#00c717",
    "#0056c7",
    "#c70059",
    "#03ccc7",
  ];
  var A = 0,
    B = 2,
    C = 3,
    D = 4;
  //Get the new height and width
  p.resetHeight = function() {
    width = document.getElementById("anim-holder").clientWidth;
    height = document.getElementById("anim-holder").clientHeight;
  };

  p.onStartLoad = function() {
    console.log("Sound loaded");
    p.setSongInfo();
    state.seek = 0.1;
    state.song_ready = true;
    if (state.anim_ready) {
      p.launchAnim();
    }
    if (state.wasOnPlay) {
      p.playMusic();
    }
    state.snackbar_text = "Sound has loaded";
  };

  p.onErrorLoad = function() {
    state.snackbar_text = "mamamia something wrong happened";
  };

  p.songIsOver = function() {
    //p.playNext();
    console.log("song is over");
  };

  p.loadSong = function() {
    state.song_ready = false;
    state.seek = 0;
    if (song && song.isPlaying()) {
      p.pauseMusic();
      state.wasOnPlay = true;
    } else {
      state.wasOnPlay = false;
    }
    if (state.anim_ready) {
      p.stopAnim();
    }
    if (state.song_mode == 0) {
      song = p.loadSound(
        state.music_library_path +
          state.music_library[state.index_library].filename,
        p.onStartLoad,
        p.onErrorLoad,
        null
      );
      console.log(
        "Now loading " + state.music_library[state.index_library].filename
      );
      state.snackbar_text =
        "Now loading " + state.music_library[state.index_library].filename;
    } else if (state.song_mode == 1) {
      song = p.loadSound(state.input_file, p.onStartLoad, p.onErrorLoad, null);
      console.log("Now load user file :" + state.input_file.name);
      state.snackbar_text = "Now loading " + state.input_file.name;
    }
    //song.onended(p.songIsOver());
  };

  p.preload = function() {
    console.log("P5 Preload");
    console.log(
      state.music_library_path +
        state.music_library[state.index_library].filename
    );
    p.loadSong();
  };

  //Start the animation
  p.launchAnim = function() {
    //console.log("Launching animation")
    p.resetHeight();
    p.resizeCanvas(width, height);
    DoAnimation = true;
    p.loop();
  };

  //Stop the animation
  p.stopAnim = function() {
    DoAnimation = false;
    p.noLoop();
  };

  //P5 MousePressed
  p.mouseClicked = function() {
    if (p.mouseX > 0 && p.mouseX < width && p.mouseY > 0 && p.mouseY < height) {
      let l = colors.length;
      A = (A + 1) % l;
      B = (B + 1) % l;
      C = (C + 1) % l;
      D = (D + 1) % l;
    }
  };

  //P5 Keypressed
  p.keyPressed = function() {
    if (p.keyCode === p.ENTER) {
      p.toggleSong();
    } else if (p.keyCode === p.UP_ARROW) {
      p.volumeUp();
    } else if (p.keyCode === p.DOWN_ARROW) {
      p.volumeDown();
    }
  };

  //P5 Windows resized
  p.windowResized = function() {
    console.log("Window resized");
    p.resetHeight();
    p.resizeCanvas(width, height);
  };

  p.toggleSong = function() {
    if (song.isPlaying()) {
      p.pauseMusic();
    } else {
      p.playMusic();
    }
  };

  p.playNext = function() {
    state.song_mode = 0;
    if (state.randomPlay) {
      let rdm = generateRandom(0, state.music_library.length - 1);
      state.index_library = rdm;
    } else {
      let max = state.music_library.length - 1;
      if (state.index_library == max) {
        state.index_library = 0;
      } else {
        state.index_library += 1;
      }
    }
    p.loadSong();
    if (!state.wasOnPlay) {
      p.playMusic();
    }
  };

  //Play music
  p.playMusic = function() {
    console.log("P5 Play song");
    if (song.isLoaded()) {
      song.play();
      state.seek = song.currentTime();
      updateSeek = setInterval(() => {
        var t = song.currentTime();
        if (t != 0) {
          state.seek = t;
        }
      }, 250);
      state.pausestate = false;
      state.playicon = "pause";
    }
  };

  //Pause Music
  p.pauseMusic = function() {
    console.log("P5 Pause song");
    if (song.isLoaded()) {
      clearInterval(updateSeek);
      song.pause();
      state.pausestate = true;
      state.playicon = "play_arrow";
    }
  };

  p.jumpMusic = function(timeCue) {
    console.log("P5 Jump song to " + timeCue);
    if (state.song_ready == true) {
      p.stopAnim();
      song.jump((song.duration() / 100) * timeCue);
      p.launchAnim();
    } else {
      console.log("jumpmusic : Audio file is not ready yet");
    }
  };

  p.setSongVolume = function() {
    volume = state.volumeScale / 10;
    song.setVolume(volume);
    console.log("Store : volume " + volume);
  };

  p.volumeUp = function() {
    console.log("P5 Volume Up");
    if (state.volumeScale < 10) {
      state.volumeScale += 1;
    }
    p.setSongVolume();
  };

  p.volumeDown = function() {
    console.log("P5 Volume Down");
    if (state.volumeScale > 0) {
      state.volumeScale -= 1;
    }
    p.setSongVolume();
  };

  p.setSongInfo = function() {
    state.currentSongDuration = song.duration();
  };

  p.setAngleDegree = function() {
    p.angleMode(p.DEGREES);
  };

  p.setAngleRadiant = function() {
    p.angleMode(p.RADIANS);
  };

  p.setAnimationParameters = function() {
    switch (state.anim_choice) {
      case "SimpleCircle":
        p.setAngleDegree();
        break;
      case "":
        break;
      case "TrapNation":
        p.setAngleDegree();
        break;
      default:
        p.setAngleRadiant();
        break;
    }
  };

  //P5 Setup
  p.setup = function() {
    console.log("P5 Setup Start");
    p.frameRate(30);
    //If loaded on page /animation or not
    if (document.getElementById("anim-holder") != null) {
      p.resetHeight();
      p.createCanvas(width, height);
    } else {
      p.createCanvas(200, 200);
      p.noLoop();
    }

    if (song.isLoaded()) {
      state.currentSongDuration = song.duration();
    }

    //Set song on pause
    song.stop();
    state.playstate = false;
    p.setSongInfo();
    //Set volume
    song.setVolume(volume);
    //Setting up song analysers
    amplitude = new P5.Amplitude();
    FFT = new P5.FFT(0.9, 128);
    console.log("P5 Setup Done");
    state.anim_ready = true;
  };

  //P5 Draw
  p.draw = function() {
    if (DoAnimation) {
      levels = amplitude.getLevel();
      spectrum = FFT.analyze();
      p.background(0);
      eval("state.p5Instance." + state.anim_choice + "()");
    }
  };

  //Animation line of frequencies with circles
  p.CircleFFT = function() {
    p.noFill();
    p.strokeWeight(levels * 4);
    //var levelScale = p.map(levels, 0, 1, 1, 10);
    for (var i = 0; i < spectrum.length; i += 2) {
      var red = p.map(spectrum[i], 0, 256, 1, 255);
      var green = p.map(spectrum[i], 0, 256, 1, 255);
      var blue = p.map(spectrum[i], 0, 256, 1, 255);
      p.stroke(red, green, blue);
      var x = p.map(i, 0, spectrum.length, 0, width);
      var r = p.map(spectrum[i], 0, binCount, 0, 400);
      p.ellipse(x, height / 2, r, r);
      p.ellipse(x, height / 2, r * 0.66, r * 0.66);
      p.ellipse(x, height / 2, r * 0.33, r * 0.33);
    }
  };

  var count1 = 0;
  var count2 = 0;
  p.radialFFT_lines = function() {
    p.noFill();
    p.translate(width / 2, height / 2);
    p.radialFigure_lines(400, 0 + count1, colors[A]);
    p.radialFigure_lines(300, 60 - count2, colors[B]);
    p.radialFigure_lines(200, 120 + count2, colors[C]);
    p.radialFigure_lines(100, 180 - count1, colors[D]);
    count1 += 0.003;
    count2 += 0.002;
    if (count1 > 1) {
      count1 = 0;
    }
    if (count2 > 1) {
      count2 = 0;
    }
  };

  p.radialFFT_points_circular = function() {
    p.noFill();
    p.translate(width / 2, height / 2);
    p.strokeWeight(2.8);
    p.radialFigure_points(320, 0 + count1, colors[A]);
    p.radialFigure_points(260, 60 - count1, colors[B]);
    p.radialFigure_points(200, 120 + count1, colors[C]);
    p.radialFigure_points(140, 180 - count1, colors[D]);
    count1 += (levels * 4) / 1000;
  };

  p.radialFFT_points = function() {
    p.noFill();
    p.translate(width / 2, height / 2);
    p.strokeWeight(2.8);
    p.radialFigure_points(320, 0, "#4c00c7");
    p.radialFigure_points(260, 0, "#c70039");
    p.radialFigure_points(200, 0, "#FF5733");
    p.radialFigure_points(140, 0, "#00c760");
  };

  p.radialFFT_triangles = function() {
    p.noFill();
    p.translate(width / 2, height / 2);
    p.radialFigure_triangles(320, 0 + count1, "#4c00c7", 255);
    p.radialFigure_triangles(260, 60 - count2, "#c70039", 220);
    p.radialFigure_triangles(200, 120 + count2, "#FF5733", 190);
    p.radialFigure_triangles(140, 180 - count1, "#00c760", 160);
    count1 += 0.003;
    count2 += 0.002;
    if (count1 > 1) {
      count1 = 0;
    }
    if (count2 > 1) {
      count2 = 0;
    }
  };

  p.radialFigure_lines = function(maxRadius, offset, hexColor) {
    p.stroke(hexColor);
    p.strokeWeight(levels * 3.5 + 1);
    p.beginShape();
    var minRadius = 0;
    for (var i = 0; i < spectrum.length - 1; i += 2) {
      var angle = p.map(i, 0, spectrum.length, 0, 300 + Math.sin(offset) * 7);
      var amp = spectrum[i];
      var r = p.map(
        amp,
        0,
        256,
        minRadius + 50 * levels,
        maxRadius + 50 * levels
      );
      var x = r * Math.cos(angle + offset);
      var y = r * Math.sin(angle + offset);
      p.vertex(x, y);
    }
    p.endShape();
  };

  p.radialFigure_points = function(maxRadius, offset, hexColor) {
    p.stroke(hexColor);
    p.beginShape(p.POINTS);
    var minRadius = 0;
    for (var i = 0; i < spectrum.length - 1; i += 2) {
      var angle = p.map(i, 0, spectrum.length, 0, 300 + Math.sin(offset) * 7);
      var amp = spectrum[i];
      var r = p.map(
        amp,
        0,
        255,
        minRadius + 50 * levels,
        maxRadius + 50 * levels
      );
      //var r = p.map(amp, 0, 256, minRadius, maxRadius);
      var x = r * Math.cos(angle + offset);
      var y = r * Math.sin(angle + offset);
      p.vertex(x, y);
    }
    p.endShape();
  };

  p.radialFigure_triangles = function(maxRadius, offset, hexColor, grey) {
    p.stroke(hexColor);
    p.strokeWeight(levels * 3.5);
    p.fill(grey * levels);
    p.beginShape(p.TRIANGLES);
    var minRadius = 0;
    for (var i = 0; i < spectrum.length - 1; i += 1) {
      var angle = p.map(i, 0, spectrum.length, 0, 300 + Math.sin(offset) * 7);
      var amp = spectrum[i];
      var r = p.map(
        amp,
        0,
        255,
        minRadius + 50 * levels,
        maxRadius + 50 * levels
      );
      var x = r * Math.cos(angle + offset);
      var y = r * Math.sin(angle + offset);
      p.vertex(x, y);
    }
    p.endShape();
  };

  p.TrapNation = function() {
    p.noStroke();

    p.translate(width / 2, height / 2);
    var minradius = 100;
    p.TrapNation_sub(minradius, 150, "#00c760", 0);
    p.TrapNation_sub(minradius, 130, "#c70039", 0);
    p.TrapNation_sub(minradius, 120, "#4c00c7", 0);
    p.fill(255);
    p.ellipse(0, 0, minradius, minradius);
  };

  p.TrapNation_sub = function(minradius, radius, color, offset) {
    p.fill(color);
    p.beginShape();
    for (var i = 0; i < spectrum.length; i += 1) {
      var angle = p.map(i, 0, spectrum.length, 0, 360) + offset;
      var amp = spectrum[i];

      var r = p.map(amp, 0, 255, 0, radius);
      var x = r * p.cos(angle);
      var y = r * p.sin(angle);
      p.vertex(x, y);
    }
    p.endShape();
  };

  p.SimpleCircle = function() {
    p.noStroke();
    p.fill(255);
    p.translate(width / 2, height / 2);
    p.beginShape();
    for (var i = 0; i < spectrum.length; i += 1) {
      var angle = p.map(i, 0, spectrum.length, 0, 360);
      var amp = spectrum[i];
      var r = p.map(amp, 0, 255, 20, 300 + levels * 400);
      var x = r * p.cos(angle);
      var y = r * p.sin(angle);
      p.vertex(x, y);
    }
    p.endShape();
  };

  p.freqBars = function() {
    p.fill(colors[A]);
    p.stroke(colors[A]);
    p.strokeWeight(1);
    var zeroo = false;
    for (var i = 0; i < spectrum.length; i++) {
      var x = p.map(i, 0, spectrum.length, 0, width);
      if (!zeroo && spectrum[i] == 0) {
        console.log(x + " " + i);
        zeroo = true;
      }
      var h = -height + p.map(spectrum[i], 0, 255, height, 0.4 * height);
      p.rect(x, height, width / spectrum.length, h);
    }
  };

  p.drawWaveform = function() {
    var waveform = FFT.waveform();
    p.noFill();
    p.beginShape();

    p.stroke(255, 255, 255); // waveform is white
    p.strokeWeight(1);
    for (var i = 0; i < waveform.length; i += 5) {
      var x = p.map(i, 0, waveform.length, 0, width);
      var y = p.map(waveform[i] / 5, -1, 1, 0, height);
      p.vertex(x, y);
    }
    p.endShape();
  };

  p.levelBackground = function() {
    p.background(p.map(levels, 0, 1, 0, 255));
  };
};

export { sketch };
