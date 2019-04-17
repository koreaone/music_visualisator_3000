todo:

DONE -- 1. volume bar
DONE -- 2. play btn/icon sync with vuex
DONE -- 3. loading page + display only when loaded
DONE -- 4. playbar
DONE -- 5. colors
6. home/about
    tabs in about
7. DONE -- file 
    *   DONE -- btns
    *   DONE -- load user input
    *   DONE -- load library music
    *   DONE -- Store link
    *   DONE --fix bugs
        * DONE -- stop anim when change
        * DONE --  onload function
        * DONE --  loading state ? put disabled on btn when song not loaded
        * during loading show loading state in footer 
        * DONE -- update song informations (duration)
        * DONE --fix the bug when clicking progress bar while song not         
    * DONE -- local music list

8. on click anim stop music or move camera ?
9. advanced settings with sliders & shit
DONE -- 10.  onsong finish, change playstate, icons, and all
11. show fps option
    let fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);

12. https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
anim ideas :
* peak detector / change colors
* only reset background after a peak or time ?
* point with no spin