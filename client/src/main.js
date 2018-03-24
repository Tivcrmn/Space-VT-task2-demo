import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import {
  Input,
  Select,
  Option,
  Button,
  Dialog
} from 'element-ui'
Vue.use(VueResource)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Dialog)

new Vue({
  el: '#app',
  render: h => h(App)
})
