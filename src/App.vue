<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex items-center gap-6">
      <img src="./assets/logo.png" class="w-20 p-2">
      <h1 class="font-black text-4xl text-secondary">joelbc-spotify</h1>
      <router-link to="/" class="ml-6 font-semibold text-xl" active-class="active-link">Home</router-link>
      <router-link to="/my-music" class="ml-6 font-semibold text-xl" active-class="active-link">My Music</router-link>
    </div>
    <router-view class="flex-grow"></router-view>

    <footer class="py-4 mt-auto">
      <a href="http://joelbc-design.web.app" class="text-center block text-white">Built by Joel Christensen 2023</a>
    </footer>
  </div>
</template>

<script>

</script>

<style scoped>

</style>
