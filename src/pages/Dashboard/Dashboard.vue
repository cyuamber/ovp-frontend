<template>
  <div>
    <p>Dashboard</p>
    <test-page></test-page>
  </div>
</template>

<script>
import TestPage from "../TestPage.vue";

export default {
  name: "Dashboard",
  components: {
    "test-page": TestPage
  }
};
</script>