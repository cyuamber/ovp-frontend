export const PackageMGTTabs = [
  {
    key: 'VNF',
    val: 101
  },
  {
    key: 'PNF',
    val: 102
  }
]
export const VnfpnfSuiteColumns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Vendor',
    dataIndex: 'vendor'
  },
  {
    title: 'Version',
    dataIndex: 'version'
  },
  {
    title: 'Type',
    dataIndex: 'typeCH.dictLabel'
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 300,
    scopedSlots: { customRender: 'action' }
  }
]
