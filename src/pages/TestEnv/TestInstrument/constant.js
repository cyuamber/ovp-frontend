export const TestInsrigisterColumns = [
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
    title: 'Address',
    dataIndex: 'address'
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 180,
    scopedSlots: { customRender: 'action' }
  }
]
