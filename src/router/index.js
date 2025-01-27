import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/college',
      name: 'college-quiz',
      component: () => import('../views/CollegeQuizView.vue'),
    },
    {
      path: '/new',
      name: 'new',
      component: () => import('../views/NewQuiz.vue'),
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('../views/ResultsPage.vue'),
    },

  ],
})

export default router
