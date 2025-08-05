<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
//import EssentialLink from "components/EssentialLink.vue";

export default defineComponent({
  name: "MainLayout",

  data() {
    return {};
  },
});
</script>
