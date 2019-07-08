<template>
  <div class="settings">
    <input type="checkbox"
      v-model="formData.disableHTTPS"
    >
    <label>Disable HTTPS</label><br>
    <input type="checkbox"
      v-model="formData.trustAllApps"
    >
    <label>Trust All Apps</label>
  </div>
</template>

<script>
  import electronSettings from 'electron-settings'

  export default {
    name: 'settings',

    data () {
      return {
        formData: {
          disableHTTPS: electronSettings.get('disableHTTPS', false),
          trustAllApps: electronSettings.get('trustAllApps', false)
        }
      }
    },

    watch: {
      formData: {
        handler () {
          for (const k in this.formData) {
            electronSettings.set(k, this.formData[k])
          }
          console.log(electronSettings.getAll())
        },
        deep: true
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
