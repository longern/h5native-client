<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer app permanent>
        <v-list dense>
          <v-list-tile v-ripple @click.prevent>
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-t="'Settings'"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-ripple @click="handleCloseAllApps">
            <v-list-tile-action>
              <v-icon>close</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-t="'Close All Apps'"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-content>
        <v-container>
          <settings></settings>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import Settings from '@/components/Settings.vue'
  import { remote } from 'electron'

  export default {
    name: 'h5native-client',

    methods: {
      handleCloseAllApps () {
        remote.app.quit()
      }
    },

    components: {
      Settings
    }
  }
</script>

<style lang="scss">
$material-design-icons-font-directory-path: '~material-design-icons-iconfont/dist/fonts/';

@import '~material-design-icons-iconfont/src/material-design-icons';
</style>

<i18n>
{
  "zh-hans": {
    "Settings": "设置",
    "Close All Apps": "关闭所有应用"
  }
}
</i18n>
