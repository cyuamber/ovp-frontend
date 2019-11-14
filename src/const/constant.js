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
const axiosgetType = 'axiospost';
const TestSUTTabs =[{
    key:"VNF",
    val:101
},{
    key:"PNF",
    val:102
},{
    key:"NFVI",
    val:103
}]
const TestSUTColumns = [{
    title: 'ID',
    dataIndex: 'id'
},
{
    title: 'Name',
    dataIndex: 'name'
},
{
    title: 'Type',
    dataIndex: 'type.dictLabel'
},
{
    title: 'Vendor',
    dataIndex: 'version'
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
    },
    width: 250
}
]
const testEnvVIMColumns = [
    {
        title: 'NO.',
        dataIndex: 'id',
        fixed: 'left',
        width: 50,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        scopedSlots: {
            customRender: 'state'
        },
    },
    {
        title: 'Cloud Owner',
        dataIndex: 'cloudOwner'
    },
    {
        title: 'Cloud Region ID',
        dataIndex: 'cloudRegionId',
    },
    {
        title: 'Cloud Type',
        dataIndex: 'cloudType',
    },
    {
        title: 'Cloud Version',
        dataIndex: 'cloudVersion',
    },
    {
        title: 'User Name',
        dataIndex: 'username'
    },
    {
        title: 'Default Tenant',
        dataIndex: 'defaultTenant'
    },
    {
        title: 'Create Time',
        dataIndex: 'createTime'
    },
    {
        title: 'Auth URL',
        dataIndex: 'authUrl'
    },
    // {
    //     title: 'Tenant',
    //     dataIndex: 'tenant'
    // },
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
const testEvnVNFMColumns = [
    {
        title: 'NO.',
        dataIndex: 'id',
        fixed: 'left',
        width: 50,
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Type',
        dataIndex: 'type'
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
        title: 'URL',
        dataIndex: 'url'
    },
    {
        title: 'VIM',
        dataIndex: 'vim'
    },
    {
        title: 'Create Time',
        dataIndex: 'createTime'
    },
    {
        title: 'User Name',
        dataIndex: 'username'
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
];
const testJobColumns = [
    {
        title: 'No.',
        dataIndex: 'index',
        fixed: 'left',
        width: 50
    },
    {
        title: 'VNF Name',
        dataIndex: 'VNFName',
    },
    {
        title: 'Job Name',
        dataIndex: 'jobName'
    },
    {
        title: 'Job Description',
        dataIndex: 'jobDescription'
    },
    {
        title: 'Test Speciflcation',
        dataIndex: 'testSpeciflcation'
    },
    {
        title: 'Created Time',
        dataIndex: 'createTime'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: 70,
        scopedSlots: {
            customRender: 'status'
        },
    },
    {
        title: 'Action',
        dataIndex: 'action',
        fixed: 'right',
        width: 350,
        scopedSlots: {
            customRender: 'action'
        },
    }
]
const TestInsrigisterColumns = [
    {
        title: 'Name',
        dataIndex: 'meterSysName'
    },
    {
        title: 'Vendor',
        dataIndex: 'meterSysVendor'
    },
    {
        title: 'Mnt Address',
        dataIndex: 'meterSysUrl'
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
const VnfpnfSuiteColumns = [
    {
        title: 'Name',
        dataIndex: 'tesyMeterName'
    },
    {
        title: 'Vendor',
        dataIndex: 'tesyMeterVendor'
    },
    {
        title: 'Version',
        dataIndex: 'tesyMeterVersion'
    },
    {
        title: 'Type',
        dataIndex: 'tesyMeterType'
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
const TestSpecColumns = [
    {
        title: 'ID',
        dataIndex: 'testSpecId'
    },
    {
        title: 'Name',
        dataIndex: 'testSpecName'
    },
    {
        title: 'Version',
        dataIndex: 'testSpecVersion'
    },
    {
        title: 'SUT Type',
        dataIndex: 'VNFtype'
    },
    {
        title: 'Publish ORG',
        dataIndex: 'PublishORG'
    },
    {
        title: 'Publish Time',
        dataIndex: 'publishTime'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        width: 180,
        scopedSlots: { customRender: 'action' }
    }
]
const TestCaseColumns = [
    {
        title: 'ID',
        dataIndex: 'id'
    },
    {
        title: 'Name',
        dataIndex: 'name'
    },
    {
        title: 'Description',
        dataIndex: 'description'
    },
    // {
    //     title: 'Version',
    //     dataIndex: 'testCaseVersion'
    // },
    {
        title: 'Status',
        dataIndex: 'status',
        width: 180,
        scopedSlots: {
            customRender: 'status'
        },
    },
]
const VIMForm = [
    {
        title: 'Cloud Owner',
        key: 'cloudOwner'
    },
    {
        title: 'Cloud Region ID',
        key: 'cloudRegionId',
    },
    {
        title: 'Cloud Type',
        key: 'cloudType',
    },
    {
        title: 'Cloud Region Version',
        key: 'cloudVersion',
    },
    {
        title: 'User Name',
        key: 'username'
    },
    {
        title: 'Password',
        key: 'password'
    },
    {
        title: 'Auth URL',
        key: 'authUrl',
    },
    {
        title: 'ssl Cacert',
        key: 'sslCacert',
    },
    {
        title: 'ssl Insecure',
        key: 'sslInsecure',
    },
    {
        title: 'Cloud Domain',
        key: 'cloudDomain',
    },
    {
        title: 'Default Tenant',
        key: 'defaultTenant'
    }
]
const VNFMForm = [
    {
        title: 'Name',
        key: 'name'
    },
    {
        title: 'Type',
        key: 'type'
    },
    {
        title: 'Vendor',
        key: 'vendor',
    },
    {
        title: 'Version',
        key: 'version',
    },
    {
        title: 'URL',
        key: 'url'
    },
    {
        title: 'VIM',
        key: 'vim',
    },
    {
        title: 'Certificate URL',
        key: 'certificateUrl',
    },
    {
        title: 'User Name',
        key: 'username',
    },
    {
        title: 'Password',
        key: 'password'
    }
]
const SUTType = ['VNF', 'PNF', 'XNF']

export {
    mockcolumns,
    axiosgetType,
    TestSUTTabs,
    TestSUTColumns,
    testEnvVIMColumns,
    testEvnVNFMColumns,
    TestInsrigisterColumns,
    VnfpnfSuiteColumns,
    TestSpecColumns,
    testJobColumns,
    TestCaseColumns,
    VIMForm,
    VNFMForm,
    SUTType
}