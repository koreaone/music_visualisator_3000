<template>
    <v-card flat width="100%" height="100%" style="text-align:justify">
        <v-card-title class="ml-4">
            <h1><b>Who are we</b></h1>
        </v-card-title>
        <v-card-text>
            <v-timeline align-top>
                <v-timeline-item v-for="(item, i) in items" :key="i" :color="item.color" :icon="item.icon" fill-dot>
                    <v-card :color="item.color" dark >
                        <v-card-title class="title"> {{item.name}} &middot; {{ item.age }}</v-card-title>
                            <v-card-text class="white text--primary">
                                <blockquote>{{item.description}}</blockquote>
                            </v-card-text>
                    </v-card>
                </v-timeline-item>
            </v-timeline>
        </v-card-text>
    </v-card>
</template>


<script>
export default {
    data (){
        return {
           items:[
               {name: "Mathieu C.", 
                age:"21", 
                description:"I'm the primary developper on this project. I'm a french student from the IT enginner school EPITA !",
               },
               {name: "Aida Z.", 
                age:"20", 
                description:"I'm an IT student from Sejong University in Seoul, South Korea !"
               },
               {name: "Rasul I.", 
                age:"20", 
                description:"I'm an IT student from Sejong University in Seoul, South Korea !"
               },
               {name: "Yussuf A.", 
                age:"20", 
                description:"I'm an IT student from Sejong University in Seoul, South Korea !"
               },
           ]
        }
    }
}
</script>
