<template>
  <div class="settings">
    <v-switch
      v-model="formData.disableHTTPS"
      :label="$t('Disable HTTPS')"
    ></v-switch>
    <v-switch
      v-model="formData.trustAllApps"
      :label="$t('Trust All Apps')"
    ></v-switch>
    <v-switch
      v-model="formData.developerMode"
      :label="$t('Developer Mode')"
    ></v-switch>
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
          trustAllApps: electronSettings.get('trustAllApps', false),
          developerMode: electronSettings.get('developerMode', false)
        }
      }
    },

    watch: {
      formData: {
        handler () {
          for (const k in this.formData) {
            electronSettings.set(k, this.formData[k])
          }
        },
        deep: true
      }
    }
  }
</script>

<style>
  /* CSS */
</style>

<i18n>
{
  "zh-hans": {
    "Developer Mode": "开发者模式",
    "Disable HTTPS": "禁用 HTTPS",
    "Trust All Apps": "信任所有应用"
  }
}
</i18n>
