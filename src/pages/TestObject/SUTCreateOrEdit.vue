<template>
	<a-modal
		:title="(isEdit === true ? 'Edit ': 'Create ') + currentTab + ' SUT'"
		v-model="visible"
		:footer="null" 
		@cancel="handleCancel"
	>
		<template>
			<a-form :form="form" @submit="handleSubmit" class="form">
				<a-form-item
					:label=" currentTab +' Name'"
					:label-col="{ span: 7 }"
					:wrapper-col="{ span: 12 }"
				>
					<a-input
						v-decorator="[
							'testName',
							{ rules: [{ required: true, message: currentTab +' Name is required' }], initialValue: VNFTest.VNFTestName },
						]"
					/>
				</a-form-item>
				<a-form-item :label="currentTab + ' Type'" :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
					<!-- @dropdownVisibleChange="handleExpand"  -->
					<a-select class="form__select" :disabled="spin"
						v-decorator="['typeName',{ rules: [{ required: true, }],initialValue: this.isEdit ? VNFTest.VNFTypeName:VNFOptions[0]}]">
						<a-select-option v-for="type in VNFOptions" :key="type" :value="type"> {{type}} </a-select-option>
					</a-select>
					<a-spin :spinning="spin">
						<a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
					</a-spin>
				</a-form-item>
				<a-form-item
					:label="currentTab + ' Vendor'"
					:label-col="{ span: 7 }"
					:wrapper-col="{ span: 12 }"
				>
					<a-input
						v-decorator="[
							'vendor', { rules: [{ required: true, message: 'Vendor is required' }], initialValue: VNFTest.VNFTestVendor},
						]"
					/>
				</a-form-item>
				<a-form-item label="Vension" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
					<a-input
						v-decorator="[
					'version', { rules: [{ required: true, message: 'Version is required' }], initialValue: VNFTest.VNFTestVersion},
				]"
					/>
				</a-form-item>
				<a-form-item label="Upload CSAR File" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
					<a-upload-dragger
							:remove="handleRemove"
							:beforeUpload="beforeUpload"
							class="form__upload-float"
							name="files"
							v-decorator="['upload',{valuePropName: 'fileList',getValueFromEvent: normFile,rules: [{ required: true,}]}]"
					>
						<p class="ant-upload-text form__upload-text--font-size">
							<a-icon type="upload"/>&nbsp;&nbsp;&nbsp;<span>Click or drag to upload</span>
						</p>
					</a-upload-dragger>
					<a-spin  :spinning="uploading" class='skip-size form__skip-float'>
						<a-icon slot="indicator"  type="loading-3-quarters" size="small" spin />
					</a-spin>
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 12, offset: 10 }">
					<a-button type="primary" html-type="submit" :disabled="uploading">Submit</a-button>
				</a-form-item>
			</a-form>
		</template>
		
	</a-modal>
</template>

<script type="text/ecmascript-6">
import moment from 'moment';
import {axiosCancelToken} from '../../utils/http'
import {mapState} from 'vuex';

	export default {
		props: ['isEdit', 'currentTab'],
		data(){
			return {
				form: this.$form.createForm(this),
				selected: '',
				count: 0,
				spin: true,
				uploading: false
			}
		},
		computed: {
			...mapState({
				VNFOptions: state => state.testSUT.VNFOptions,
				VNFTest: state => state.testSUT.VNFTest,
			}),
			visible: {
				get(){
					return this.$store.state.testSUT.visible
				},
				set(val){
					if(!val) {
						this.$store.commit('testSUT/updateVNFTest', {})
						this.form.setFieldsValue({testName: '', version: '', vendor: '', typeName: ''})
					}
				}
			}
		},
		watch: {
			visible(val){
				if(val) {
					this.count ++
					if(this.isEdit && this.count > 1){
						this.form.setFieldsValue({
							testName: this.VNFTest.VNFTestName,
							vendor: this.VNFTest.VNFTestVendor,
							version: this.VNFTest.VNFTestVersion,
							typeName: this.VNFTest.VNFTypeName
						})
					}else if(!this.isEdit && this.count >1){
						this.form.setFieldsValue({typeName: this.VNFOptions[0]})
					}
				}
			},
			VNFOptions(val){
				if(val.length) {
					this.spin = false
				}      
			},
		},
		methods: {
			handleCancel(){
                if(!this.uploading){
                    this.handleRemove();
                }
				this.$store.commit('testSUT/updateVisible', false)
			},
            normFile(e) {
                if (Array.isArray(e)) {
                    return e;
                }
                if(e.fileList.length >1){
                    e.fileList.splice(0,e.fileList.length-1)
                }
                return e && e.fileList;
            },
			handleSubmit(e){
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if(!err){
						// Did not implement the check if there is a change
                        const formData = new FormData();
                        formData.append('files', values.upload[0]);
						let data = {
							VNFTestName: values.testName,
							VNFTestVendor: values.vendor,
							VNFTestVersion: values.version,
							VNFTypeName: this.selected,
							createTime: this.isEdit ? this.VNFTest.createTime : moment(new Date()).format('YYYY-MM-DD'),
							VNFFileName: formData
						};
                        this.handleUpload(data,formData);
					}
				})
			},
			handleUpload(data,formData){
				this.uploading = true;
                this.$store.dispatch('testSUT/upload', {formData, message: this.$message}).then(
                    () => {
                        this.submitFormData(data);
                        this.uploading = false;
                        this.fileList = [];

					},
                    () => { this.uploading = false;}
                );
			},
            submitFormData(data){
                let {isEdit} = this;
                this.$store.dispatch('testSUT/createOrEditVNFTest',{isEdit,data}).then(()=>{
                    this.$store.commit('testSUT/updateVisible', false);
                    this.form.resetFields();
                },()=>{this.$store.commit('testSUT/updateVisible', false)})
			},
			handleRemove(){
                if(this.uploading){
                    axiosCancelToken("/uploadVNFFile").then(res => {
                        if(res.code === 200){
                            this.uploading = false;
                            this.$message.success('cancel upload successfully.');
                        }else {
                            this.$message.error('cancel upload failed.');
                        }
                    });
                }
			},
			beforeUpload(){
				return false
			},
			interruptUpload(){
				this.$store.dispatch('test/interrupt')
			}
		
	}
};
</script>

<style lang="less" scoped>
.form{
	.form__select{
		width: 70%;
		margin-right: 5%;
	}
	.form__upload-text--font-size{
		font-size: 12px !important;
		line-height: 3;
        margin: 0!important;
	}
	.form__upload-float{
		width: 85%;
		margin-right: 5%;
		float: left;
	}
	.form__skip-float{
		float: left;
		line-height: 3.5;
	}
}

</style>
