import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import LoggedIn from '../components/LoggedIn.vue'
import NotFound from '../components/NotFound.vue'

const routes = [
    {
        path: '/', 
        name: 'Home', 
        component: Home
    },
    {
        path: '/my-music', 
        name: 'MyMusic', 
        component: LoggedIn
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router