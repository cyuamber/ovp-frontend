const state = {
  VIMTableData: [],
  VNFMTableData: [],
  MANOTableData: [],
  pagination: { current: 1, total: 0 },
  searchKeyword: '',
  createTime: '',
  pageNum: 1,
  pageSize: 10,
  currentTab: 'VIM ENV',
  visible: false,
  cloudTypeOptions: [],
  regionIdOptions: [],
  initValues: {}
}

export default state