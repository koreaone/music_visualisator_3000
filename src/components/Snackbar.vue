<template>
    <v-snackbar v-model="snackbar" top left color="white black--text">
      {{ text }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
</template>

<script>
import { mapGetters} from 'vuex'

export default {
    data () {
      return {
        snackbar: false,
        text: ''
      }
    },
    computed: {
     ...mapGetters({
        msg : 'getSnackbarText',
     })
    },
    watch:{
        msg(newtext, oldtext){
            this.text = newtext;
            this.snackbar = true;
        }
    }
}
</script>

