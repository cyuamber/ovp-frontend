<template>
  <div>
    <p>TestCase</p>
    <test-page></test-page>
  </div>
</template>

<script>
import TestPage from "../TestPage.vue";
export default {
  name: "TestCase",
  components: {
    "test-page": TestPage
  }
};
</script>