import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About.vue'
import Animation from './views/Animation.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/animation',
      name: 'animation',
      component: Animation
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
