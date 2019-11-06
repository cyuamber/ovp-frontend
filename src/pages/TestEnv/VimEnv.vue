<template>
	<div>
		<Loading :loadingMessage="loadingMessage" />
		<a-tabs @change="handleTabsChange">
			<a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab">
				<div class="tab-content tab-content--margin">
					<a-button type="primary" @click="handleRigister">Register {{tab}}</a-button>
					<a-input
						class="tab-content__button"
						:placeholder="tab === 'VIM ENV'?'CloudType':'Name'"
						@keyup.enter="searchTypeID"
						v-model="keyword"
					>
						<a-icon slot="prefix" type="search" />
					</a-input>
					<a-date-picker
						class="tab-content__calendar"
						@change="selectedTime"
						placeholder="Select date"
					/>
				</div>
				<div class="table">
					<a-table
						:columns="tab === 'VIM ENV'? VIMColumns : VNFMColumns"
						:dataSource="tab === 'VIM ENV' ? VIMTableData : VNFMTableData"
						bordered
						:loading="loading"
						rowKey="index"
						size="default"
						:pagination="pagination"
						:scroll="{x: 1630}"
						@change="pageChange"
					>
						<span slot="state" slot-scope="state,record">
							<span
								class="showState"
								:style="{backgroundColor: record.isOnline? '#52C41A': '#F5222D'}"
								:title="record.isOnline? 'online': 'offline'"
							></span>
						</span>
						<span slot="action" slot-scope="action,record">
							<a-tag
								v-for="item in action"
								:key="item"
								:color="item === 'Edit'? 'blue' : 'red'"
								class="tag"
								@click="(() => showEditOrDeleteModal(item,record))"
							>{{item}}</a-tag>
						</span>
					</a-table>
				</div>
			</a-tab-pane>
		</a-tabs>
		<CreateOrEditModal :isEdit="isEdit" />
	</div>
</template>

<script>
import CreateOrEditModal from "./CreateOrEditModal";
import Loading from "../../components/Loading/Loading";
import { testEnvVIMColumns, testEvnVNFMColumns } from "../../const/constant";
import { mapState } from "vuex";

export default {
	name: "VimEnv",
	data() {
		return {
			tabs: ["VIM ENV", "VNFM ENV"],
			keyword: "",
			VIMColumns: testEnvVIMColumns,
			VNFMColumns: testEvnVNFMColumns,
			isEdit: false,
			loading: false,
		};
	},
	computed: {
		...mapState({
			loadingMessage: state => state.testENV.loadingMessage,
			VIMTableData: state => state.testENV.VIMTableData,
			VNFMTableData: state => state.testENV.VNFMTableData,
			pagination: state => state.testENV.pagination,
			searchKeyword: state => state.testENV.searchKeyword,
			currentTab: state => state.testENV.currentTab,
			visible: state => state.testENV.visible
		})
	},
	components: {
		Loading,
		CreateOrEditModal
	},
	mounted() {
		this.loading = true;
		this.$store.dispatch("testENV/getOptionList");
		this.$store.dispatch("testENV/getTableData", {})
			.then(() => (this.loading = false), () => (this.loading = false));
	},
	methods: {
		handleTabsChange(key) {
			this.$store.commit("testENV/changeTab", key);
			this.keyword = '';
			this.loading = true;
			this.$store.dispatch("testENV/getTableData", {})
				.then(() => (this.loading = false), () => (this.loading = false));
		},
		handleRigister() {
			this.$store.commit("testENV/updateVisible", true);
			this.isEdit = false;
		},
		searchTypeID() {
			this.$store.commit("testENV/setFilterItem", {
				key: this.keyword,
				isSearch: true,
				message: this.$message
			});
			this.$store.dispatch("testENV/setParams");
		},
		selectedTime(date, d) {
			this.$store.commit("testENV/setFilterItem", { time: d });
			this.$store.dispatch("testENV/setParams");
		},
		showEditOrDeleteModal(item, record) {
			if (item === "Edit") {
				this.$store.commit('testENV/setInitValues',{record,item});
				this.$store.commit("testENV/updateVisible", true);
				this.isEdit = true;
			} else {
				this.$confirm({
					title: "Are you sure delete this task?",
					content: "Some descriptions",
					okText: "Yes",
					okType: "danger",
					cancelText: "No",
					onOk: () => {
						this.$store.dispatch("testENV/deleteData", record);
					}
				});
			}
		},
		pageChange(pageObj) {
			this.$store.commit("testENV/setFilterItem", { pageObj });
			this.$store.dispatch("testENV/setParams");
		}
	},
    destroyed(){
        this.$store.commit("testENV/changeTab", 'VIM ENV');
	}
};
</script>

<style lang="less" scoped>
.tab-content--margin {
	margin-top: 10px;
	margin-bottom: 30px;
	.tab-content__button {
		display: inline-block;
		width: 240px;
		margin-left: 40px;
		/deep/ .ant-input {
			border-radius: 20px;
		}
	}
	.tab-content__calendar {
		float: right;
		width: 280px;
	}
}
.table {
	.tag {
		padding: 0 8px;
		border-radius: 12px;
	}
	.showState {
		display: block;
		margin: 0 auto;
		width: 15px;
		height: 15px;
		border-radius: 50%;
	}
}
/deep/ .ant-table-thead > tr > th {
	text-align: center;
	white-space: nowrap;
}
</style>