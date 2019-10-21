const mockcolumns = [{
        title: "Avatar",
        key: "avatar",
        scopedSlots: {
            customRender: "avatar"
        }
    },
    {
        title: "Name",
        dataIndex: "name"
    },
    {
        title: "Address",
        dataIndex: "address"
    },
    {
        title: "Phone",
        dataIndex: "phone"
    }
]
const VNFTypeColumns = [{
        title: 'ID',
        dataIndex: 'id'
    },
    {
        title: 'VNF Type',
        dataIndex: 'VNFTypeName'
    },
    {
        title: 'Create Time',
        dataIndex: 'createTime'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        scopedSlots: {
            customRender: 'action'
        }
    }
]
const VNFTypeObjectsColumns = [{
        title: 'Name',
        dataIndex: 'VNFTestName'
    },
    {
        title: 'Type',
        dataIndex: 'VNFTypeName'
    },
    {
        title: 'Vendor',
        dataIndex: 'VNFTestVersion'
    },
    {
        title: 'Suit',
        dataIndex: 'VNFTestVendor'
    },
    {
        title: 'Create Time',
        dataIndex: 'createTime'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        scopedSlots: {
            customRender: 'action'
        }
    }
]
const testEnvVIMColumns = [{
        title: 'State',
        dataIndex: 'state',
        fixed: 'left',
        width: 100
    },
    {
        title: 'CloudOwner',
        dataIndex: 'cloudOwner'
    },
    {
        title: 'Cloud Region ID',
        dataIndex: 'cloudRegionId',
    },
    {
        title: 'Cloud Version',
        dataIndex: 'cloudVersion',
    },
    {
        title: 'Owner Defined Type',
        dataIndex: 'ownerDefinedType',
    },
    {
        title: 'Cloud Zone',
        dataIndex: 'cloudZone'
    },
    {
        title: 'User Name',
        dataIndex: 'userName'
    },
    {
        title: 'Password',
        dataIndex: 'passwd'
    },
    {
        title: 'Auth URL',
        dataIndex: 'authUrl'
    },
    {
        title: 'Tenant',
        dataIndex: 'tenant'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        scopedSlots: {
            customRender: 'action'
        },
        fixed: 'right',
        width: 180
    }
]
const testEvnVNFMColumns = [{
        title: 'Name',
        dataIndex: 'VNFMname',
        width: 100,
        fixed: 'left'
    },
    {
        title: 'Type',
        dataIndex: 'VNFMtype'
    },
    {
        title: 'Vendor',
        dataIndex: 'VNFMvendor'
    },
    {
        title: 'Vension',
        dataIndex: 'VNFMversion'
    },
    {
        title: 'URL',
        dataIndex: 'url'
    },
    {
        title: 'VIM',
        dataIndex: 'vim'
    },
    {
        title: 'Certificate URL',
        dataIndex: 'authUrl'
    },
    {
        title: 'User Name',
        dataIndex: 'userName'
    },
    {
        title: 'Password',
        dataIndex: 'passwd'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        scopedSlots: {
            customRender: 'action'
        },
        width: 180,
        fixed: 'right'
    }
]
export {
    mockcolumns,
    VNFTypeColumns,
    VNFTypeObjectsColumns,
    testEnvVIMColumns,
    testEvnVNFMColumns
}