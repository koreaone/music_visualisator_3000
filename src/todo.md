todo:
put selected prop in vuex muisc libray
select song


DONE -- 1. volume bar
DONE -- 2. play btn/icon sync with vuex
3. loading page + display only when loaded
DONE -- 4. playbar
DONE -- 5. colors
6. home/about
    tabs in about
7. file 
    *   DONE -- btns
    *   DONE -- load user input
    *   DONE -- load library music
    *   DONE -- Store link
    *   fix bugs
        * DONE -- stop anim when change
        * DONE --  onload function
        *   loading state ? put disabled on btn when song not loaded
        * during loading show loading state in footer 
        * DONE -- update song informations (duration)
        * fix the bug when clicking progress bar while song not loaded
            create loading state
            put if in the fct
            and reset/update progress bar
            put inderterminate on progress bar ?
    * DONE -- local music list
7.bis put name of song on canvas ? and open song input dialof directly
8. on click anim stop music or move camera ?
9. advanced settings with sliders & shit
10. onsong finish, change playstate, icons, and all
11. show fps option
    let fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);

12. https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
anim ideas :
* peak detector / change colors
* only reset background after a peak or time ?