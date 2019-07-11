import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App'

Vue.use(VueI18n)
Vue.use(Vuetify)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'zh-hans'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  render: h => h(App)
})
