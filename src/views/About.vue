<template>
  <v-card full-width height="100%">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab key="1">Description</v-tab>
      <v-tab key="2">About us</v-tab>
      <v-tab key="3">Contact</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="1">
        <Description></Description>
      </v-tab-item>
      <v-tab-item key="2">
      work in progress
      </v-tab-item>
      <v-tab-item key="3">
      work in progress 
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>


<script>
import Description from "./description"

  export default {
    components : {
      Description
    },
    data () {
      return {
        tab: null
      }
    }
  }
</script>