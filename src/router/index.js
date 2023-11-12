import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import LoggedIn from '../components/LoggedIn.vue'
import NotFound from '../components/NotFound.vue'
import TrackAnalysis from '../components/TrackAnalysis.vue'

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
    {
        path: '/track-analysis/:id',
        name: 'TrackAnalysis',
        component: TrackAnalysis,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router