<template>
    <v-card flat width="100%" height="100%" style="text-align:justify">
        <v-card-title class="ml-4">
            <h1><b>The Music Visualisator 3000</b></h1>
        </v-card-title >
        <v-card-text style="font-size:18pt">
            <blockquote class="blockquote">
                The Music Visualisator 3000 is a web-based application with the purpose to visually see music. Through different animations, enjoy seeing music like never before, discover how magic music can be, see the unseen ! Explore new ways to feel the music, new ways to appreciate music ! Each song will have a unique and new feeling, it's time to rediscover your favorites tunes !
            </blockquote>
        </v-card-text>
        <v-card-text style="font-size:18pt">
            <blockquote class="blockquote">
                You can choose from one of our music samples or choose from your own personal library the music you wish ! Try out our different unique animations, each featuring its own way to visualize music. From basic forms you may have already seen to unique geometrical pattern, try out each one and let you get mesmerized some of our hypthonic animations !
            </blockquote>
        </v-card-text>
        <v-card-text style="text-align: center; color:rgba(0,0,0,0.87);">__________________________________________</v-card-text>
        <v-card-title class="ml-4">
            <h1><b>Our Motivations</b></h1>
        </v-card-title >
        <v-card-text style="font-size:18pt">
            <blockquote class="blockquote">
                This project has been created for education purposes. <i>Music Visualisator 3000</i> is a web-application for a web programming project in Sejong University, Seoul, South Korea. In thoses terms, this is a student project and is open to critisims in order to get improved. 
                 <br><br>
                Feel free to contact us in the Contact section, and learn more about the project itself in the developement section !
            </blockquote>
        </v-card-text>
        <v-card-text style="text-align: center; color:rgba(0,0,0,0.87);">__________________________________________</v-card-text>
        <v-card-title class="ml-4">
            <h1><b>Inspirations</b></h1>
        </v-card-title >
        <v-card-text style="font-size:18pt">
            <blockquote class="blockquote">
                 This web-application has been inspired by many sources. From youtube videos with amazing creation to already existing applications such as <i>Music Visualisator 3000</i>.
                 <br><br>
                 To list a few of remarkables concepts :
                 <v-list three-line>
                    <v-list-tile v-for="item in sources" :key="item.id">
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <b> {{ item.name }} &middot;</b> <i> {{ item.type }}</i>
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                            <a :href="item.link">{{item.link}}</a>
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                    </v-list-tile>
                </v-list>
                 
            </blockquote>
            <v-list>
                
            </v-list>
        </v-card-text>
          
    </v-card>
</template>


<script>
export default {
    data (){
        return {
            sources: [
                {id:0, name: "Do adive in Music",  type: "Web-application", link:"https://do.adive.in/music/501"},
                {id:1, name: "Butter Churn viz", type: "Web-application",  link: "https://butterchurnviz.com/"},
                {id:2, name: "Synesthesia", type: "Software",  link: "https://www.synesthesia.live/"},
                {id:3, name: "Videobolt", type: "Software",  link: "https://www.synesthesia.live/"},
                {id:4, name: "Shed - The Bot", type: "Video",  link: "https://vimeo.com/56268440"},
                {id:5, name: "Phýllon - Music Visualization", type: "Video",  link: "http://www.vsxu.com/"},
                {id:6, name: "Proximity's videos", type: "Video",  link: "https://www.youtube.com/user/PandoraMuslc"},
                {id:7, name: "Therewasaguy github's page ", type: "Website",  link: "https://therewasaguy.github.io/p5-music-viz/"},
            ],
        }
    }
}
</script>
