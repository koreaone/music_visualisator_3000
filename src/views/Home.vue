<template>
  <v-card height="100%" wdith="100%" style="overflow:hidden;">
    <v-img src="./logo.png" aspect-ratio="2.75"></v-img>
    <v-card-actions>
      <v-layout row wrap align-center justify-center>
        <v-flex xs12 sm6>
          <div class="text-xs-center" style="width:100%">
            <v-btn color="blue darken-1" dark large :loading="loading" to="/animation">
              <v-icon class="mr-2">play_arrow</v-icon> Start now 
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs12 sm6>
          <div class="text-xs-center" style="width:100%">
            <v-btn color="blue darken-1" dark large to="/about">
              <v-icon class="mr-2">info</v-icon> Learn More ! 
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-card-actions>
    <v-card-text>
      <h2><b>Updates </b></h2>
      <v-list three-line>
        <v-list-tile v-for="item in updates" :key="item.id">
          <v-list-tile-content>
            <v-list-tile-title>
                <b><i>{{item.version }}</i> &middot; <i>{{item.date}}</i> &middot; {{ item.title}}</b>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{item.description}}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card-text>
    <v-card-text>
      <h2><b> Road map</b></h2>
      <v-list>
        <v-list-tile v-for="item in roadmap" :key="item">
            <v-list-tile-title>
                <b>&middot; {{item}}</b>
            </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters} from 'vuex'
  export default {
    data: () => ({
    loading : true,
    updates : [
      {id: 1, date:"19 April 2019", version: "1.01", title: "Minor fixes !", description: "Fixes of visuals glitches and bug on Google Chrome Browser regarding file input !"},
      {id: 0, date:"16 April 2019", version: "1.00", title:"Website launch !", description : "Version 1 is out, Music Visualisator is now out online ! Please, enjoy our application and don't hestitate to give us some feedbacks"},

    ],
    roadmap:["Mic support", "More animations", "Account support", "Proper mobile support"]
    }), 
    computed: {
     ...mapGetters({
        loading_state : 'getAnimready'
     })
    },
    watch: {
      loading_state(newVal, oldVal){
        this.loading = !newVal;
      }
    },
    mounted: function () {

      this.loading = !this.loading_state;
    }

  }
</script>


<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>