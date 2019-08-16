<template>
  <div>
    <p>VnfType</p>
    <test-page></test-page>
  </div>
</template>

<script>
import TestPage from "../TestPage.vue";
export default {
  name: "VnfType",
  components: {
    "test-page": TestPage
  }
};
</script>