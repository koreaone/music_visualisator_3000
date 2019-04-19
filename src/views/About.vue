<template>
  <v-card full-width height="100%">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab key="1">Description</v-tab>
      <v-tab key="2">Moreover</v-tab>
      <v-tab key="3">Contact</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="1">
        <Description></Description>
      </v-tab-item>
      <v-tab-item key="2">
        <Aboutus></Aboutus>
      </v-tab-item>
      <v-tab-item key="3">
        <Contact></Contact>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>


<script>
import Description from "./Description"
import Aboutus from "./Aboutus"
import Contact from "./Contact"

  export default {
    components : {
      Description, Aboutus, Contact
    },
    data () {
      return {
        tab: null
      }
    }
  }
</script>