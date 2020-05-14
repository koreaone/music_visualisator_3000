<template>
  <v-card full-width height="100%">
    <v-tabs
      v-model="tab"
      fixed-tabs
      slider-color=""
      color="blue lighten-5"
      height="58"
    >
      <v-tab key="1" active-class="primary--text">Description</v-tab>
      <v-tab key="2" active-class="primary--text">About me</v-tab>
      <v-tab key="3" active-class="primary--text">Moreover</v-tab>
      <v-tab key="4" active-class="primary--text">Contact</v-tab>
      <v-tab key="5" active-class="primary--text">Conditions and Terms</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="1">
        <Description></Description>
      </v-tab-item>
      <v-tab-item key="2">
        <Aboutus></Aboutus>
      </v-tab-item>
      <v-tab-item key="3">
        <Moreover></Moreover>
      </v-tab-item>
      <v-tab-item key="4">
        <Contact></Contact>
      </v-tab-item>
      <v-tab-item key="5">
        <ConditionsTerms></ConditionsTerms>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import Description from "./description";
import Aboutus from "./Aboutus";
import Contact from "./Contact";
import Moreover from "./Moreover";
import ConditionsTerms from "./ConditionsTerms";

export default {
  components: {
    Description,
    Aboutus,
    Contact,
    Moreover,
    ConditionsTerms,
  },
  data() {
    return {
      tab: null,
    };
  },
};
</script>
