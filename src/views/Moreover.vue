<template>
    <v-card flat width="100%" height="100%" style="text-align:justify">
        <v-card-title class="ml-4">
            <h1><b>About the application</b></h1>
        </v-card-title>
        <v-card-text>
            <blockquote class="blockquote">
                <i>Music Visualisator 3000</i> is a web-based application built with the <a href="https://vuejs.org/">Vue.js</a> framework and the <a href="https://p5js.org/">p5.js</a> library ! 
                Vue is used from the achictecture of the application and its general functionning. 
                P5.js is handleling the audio and animation part. All the aesthics of the application is handled by <a href="https://vuetifyjs.com/en/">Vuetify</a>, a visual-library for Vue.js ! 
                On the Back-end, a <a href="https://firebase.google.com/">firebase databse</a> is setup for some data purposes. 
                This app was developped using a webpack through npm, using vue-cli. In addition, modules used are vuex, vue-router, vue-ressource.
            </blockquote>
            <blockquote class="blockquote">
                All the animation were made by hands, using tutorials, inspiration sources, or our imagination !
            </blockquote>
            <blockquote class="blockquote">
                <i>Music Visualisator 3000</i> is open-source and its code is available here : <a href="https://github.com/koreaone/music_visualisator_3000">our github page</a>. Feel free to contact us in the contact section.
            </blockquote>
        </v-card-text>
        <v-card-title class="ml-4">
            <h1><b>What helped us</b></h1>
        </v-card-title>
        <v-card-title class="ml-4">
            <span style="font-size:15pt">Animation & audio</span>
        </v-card-title>
        <v-list three-line class="ml-4">
            <v-list-tile v-for="item in sources" :key="item.id">
                <v-list-tile-content>
                    <v-list-tile-title>
                        <b> &middot; {{ item.name }} </b>
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                        <a :href="item.link">{{item.link}}</a>
                    </v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
          
    </v-card>
</template>


<script>
export default {
    data (){
        return {
           sources: [
                {id:0, name: "Processing/P5.js Course on audio visualisation", link:"https://www.cg.tuwien.ac.at/courses/Seminar/WS2010/processing.pdf"},
                {id:1, name: "alevalenti44/P5.js-3D-Audio-Visualizer", link: "https://github.com/alevalenti44/P5.js-3D-Audio-Visualizer"},
                {id:2, name: "DavidLazic/audio-visualizer", link: "https://github.com/DavidLazic/audio-visualizer"},
                {id:3, name: "therewasaguy/p5-music-viz", link: "https://github.com/alevalenti44/P5.js-3D-Audio-Visualizer"},
                {id:4, name: "The Coding Train Youtube Channel", link: "https://www.youtube.com/user/shiffman/featured"},
                {id:5, name: "The Coding Train github", link: "https://github.com/CodingTrain/website/tree/master/Tutorials/P5JS/p5.js_sound"},
            ],
        }
    }
}
</script>
