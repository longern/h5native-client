<template>
  <div id="app">
    <v-app>
      <v-container>
        <settings></settings>
      </v-container>
    </v-app>
  </div>
</template>

<script>
  import Settings from '@/components/Settings.vue'
  export default {
    name: 'h5native-client',

    components: {
      Settings
    }
  }
</script>

<style>
  /* CSS */
</style>
