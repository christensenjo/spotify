<script>
  import Login from './components/Login.vue'
  import LoggedIn from './components/LoggedIn.vue'
  import NotFound from './components/NotFound.vue'

  const routes = {
    '/': Login,
    '/loggedIn': LoggedIn
  }

  export default {
    data() {
      return {
        currentPath: window.location.hash
      }
    },
    computed: {
      currentView() {
        // alert(this.currentPath)
        return routes[this.currentPath.slice(1) || '/'] || NotFound
      }
    },
    mounted() {
      window.addEventListener('hashchange', () => {
        this.currentPath = window.location.hash
      })
    }
  }
</script>

<template>
  <a href="/">Home  |  </a>
  <a href="/loggedIn">Log in</a>
  <component :is="currentView"></component>
</template>

<style scoped>
</style>
