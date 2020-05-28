<template>
  <div class="components-input-demo-presuffix">
    <a-date-picker
            class="tab-content__calendar"
            @change="onChangeDate"
            placeholder="Select date"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["currentPage"],
  data() {
    return {
      dateTime: "",
      // url: "",
      // key: "",
      // event: ""
    };
  },
  computed: {
    ...mapState({
        selectDateTime: state => state.datePicker.selectDateTime
    })
  },
  methods: {
    ...mapMutations("datePicker", ["setDateTime"]),
    onChangeDate(date, d) {
        this.setDateTime(d);
        this.$emit("changeDate");
    }
  },
  mounted() {

  }
};
</script>

<style lang="less" scoped>
.tab-content__calendar {
  width: 100%;
}
</style>
