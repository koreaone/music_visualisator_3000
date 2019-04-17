import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About.vue'
import Home from './views/Home.vue'
import Animation from './views/Animation.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
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
