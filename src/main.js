import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource';

Vue.use(VueResource);
Vue.http.options.root = '/root';
Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';


//Module for form verification
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)
//Module for http request handling

Vue.config.productionTip = false;

// Initialize Firebase

// const firebase = require('firebase/app');
// require('firebase/database>');




new Vue({
  router,
  store,
  http: {
    root: '/root',
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  },
  render: function (h) { return h(App) }
}).$mount('#app')

