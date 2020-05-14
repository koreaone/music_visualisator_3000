<template>
  <v-app>
    <Toolbar></Toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <Snackbar />
    <Footer></Footer>
  </v-app>
</template>

<script>
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";
import Snackbar from "./components/Snackbar";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Toolbar,
    Footer,
    Snackbar,
  },
  methods: {
    ...mapActions(["instanciateP5"]),
  },
  created: function() {
    this.instanciateP5();
  },
};
</script>
