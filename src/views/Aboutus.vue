<template>
  <v-card flat width="100%" height="100%" style="text-align: justify;">
    <v-card-title class="ml-4">
      <h1><b>Who am I ?</b></h1>
    </v-card-title>
    <v-card>
      <v-card-title>
        <h2>
          <b> {{ name }}</b>
        </h2>
      </v-card-title>
      <v-card-title>
        <p>{{ description }}</p>
      </v-card-title>
    </v-card>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      name: "Mathieu C.",
      age: "22",
      description:
        "I'm the primary developper on this project. I'm a french student from the IT engineer school EPITA !",
    };
  },
};
</script>
