<template>
  <div class="components-input-demo-presuffix">
    <a-date-picker
            class="tab-content__calendar"
            @change="onChangeDate"
            placeholder="Select date"
            :value="dateTime"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import moment from "moment";
export default {
  props: ["currentPage"],
  data() {
    return {
      dateTime: null
    };
  },
  computed: {
    ...mapState({
        selectDateTime: state => state.datePicker.selectDateTime
    })
  },
    watch: {
        selectDateTime(val) {
            this.dateTime = val===''?null:moment(val)
        }
  },
  methods: {
    ...mapMutations("datePicker", ["setDateTime"]),
    onChangeDate(date, d) {
        this.setDateTime(d);
        this.$emit("changeDate");
    },
    moment
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
