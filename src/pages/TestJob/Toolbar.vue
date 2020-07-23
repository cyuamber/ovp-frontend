<template>
  <div class="test-job__top">
    <a-button type="primary" @click="createOrEditTestJobShow">Create Test Job</a-button>
    <a-select
            class="select"
            :defaultValue="dashboardJumpStatus"
            @change="handleSelectStatusChange"
    >
      <a-select-option v-for="status of statusOptions" :key="status" :value="status">{{status}}</a-select-option>
    </a-select>
    <DatePicker class="calendar" @changeDate="changeDate"/>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { statusOptions } from "./constants";
import DatePicker from "../../components/DatePicker/DatePicker";
export default {
  name: "Toolbar",
  components: {  DatePicker },
  data() {
    return {
      statusOptions: statusOptions,
    };
  },
  computed: {
    ...mapState({
      selectDateTime: state => state.datePicker.selectDateTime
    }),
    dashboardJumpStatus: {
        get() {
            return this.$store.state.testJob.dashboardJumpStatus;
        }
    }
  },

  methods: {
    ...mapActions("testJob", [
        "getTableData",
        "getSUTType",
        "getVNFMOption",
        "getVIMOption",
        "getMANOOption",
        "getTestInstrumentOption",
    ]),
    ...mapMutations("testJob", [
      "setIsShow",
      "updateEdit",
      "setFilter",
      "updateDashboardJumpStatus",
      "clearSearchKeyword"
    ]),

    createOrEditPackage() {
      this.updateVisible(true);
      this.updateEdit(false);
      this.updateVNFTest({});
    },

    createOrEditTestJobShow() {
        this.isEdit = false;
        this.setIsShow(true);
        this.getSUTType({
            message: this.$message
        });
        this.getVNFMOption({
            message: this.$message
        });
        this.getVIMOption({
            message: this.$message
        });
        this.getMANOOption({
            message: this.$message
        });
        this.getTestInstrumentOption({
            message: this.$message
        });
    },
    changeDate() {
        this.setFilter({ time: this.selectDateTime });
        this.getTableData({ bool: true });
    },
    handleSelectStatusChange(val) {
        if (window.location.href.includes("?")) {
            window.location.href = window.location.href.split("?")[0];
        }
        this.updateDashboardJumpStatus("All");
        if (val === "All") this.clearSearchKeyword(val);
        this.setFilter({
            key: val
        });
        this.getTableData({ bool: true });
    },
  }
};
</script>

<style lang="less" scoped>

</style>
