<template>
  <div class="flex items-center gap-6">
    <img src="./assets/logo.png" class="w-20 p-2">
    <h1 class="font-black text-4xl text-secondary">joelbc-spotify</h1>

    <router-link to="/" class="ml-6 font-semibold text-xl" active-class="active-link">Home</router-link>
    <router-link to="/login" class="font-semibold text-xl" active-class="active-link">Login</router-link>
  </div>
  <router-view></router-view>
</template>

<script>

</script>

<style scoped>

</style>
