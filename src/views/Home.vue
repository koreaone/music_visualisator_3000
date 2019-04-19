<template>
  <v-card height="100%" wdith="100%" style="overflow:hidden;">
    <v-img src="./logo.png" aspect-ratio="2.75"></v-img>
    <v-card-actions>
      <v-layout row wrap align-center>
        <v-flex xs12>
          <div class="text-xs-center" style="width:100%">
            <v-btn color="blue darken-1" dark large :loading="loading" to="/animation">
              <v-icon>play_arrow</v-icon> Start now 
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters} from 'vuex'
  export default {
    data: () => ({
    loading : true
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