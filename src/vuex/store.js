// /src/vuex/store.js

import Vue from 'vue'
import Vuex from 'vuex'
import screen from './screen/store'
import user from './user/store'
import location from './location/store'
import content from './content/store'
import app from './app/store'
import uploader from './uploader/store'
import createLogger from '../plugins/logger'
import org from './org/store'
import module from './module/store'
Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    screen,
    user,
    location,
    content,
    app,
    uploader,
    org,
    module
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
