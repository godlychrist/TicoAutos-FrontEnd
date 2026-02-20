<template>
  <div id="app">
    <LoginView />
  </div>
</template>

<script>
import LoginView from './components/LoginView.vue';

export default {
  name: 'App',
  components: {
    LoginView
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #050505;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>