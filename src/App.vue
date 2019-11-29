<template>
  <div>
    <div id="app">
      <RouterView />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.getElementById("app").style.display = "block";
    document.getElementById("appLoading").style.display = "none";
  }
};
</script>

<style>
#app {
  display: none;
  height: 100vh;
  min-width: 1024px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
