const env = process.env.NODE_ENV;
const axiosgetType = env === "development" ? false : true;

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
const PackageMGTTabs = [{
    key: "VNF",
    val: 101
}, {
    key: "PNF",
    val: 102
}]
const TestSUTTabs = [{
    key: "VNF",
    val: 101
}, {
    key: "PNF",
    val: 102
}, {
    key: "NFVI",
    val: 103
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
    dataIndex: 'typeCH.dictLabel'
},
{
    title: 'Vendor',
    dataIndex: 'vendor'
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
        title: 'ID',
        dataIndex: 'id',
        fixed: 'left',
        width: 50,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        scopedSlots: {
            customRender: 'status'
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
        dataIndex: 'cloudTypeCH.dictLabel',
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
        title: 'ID',
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
const testMANOColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 50,
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Type',
        dataIndex: 'manoType',
        scopedSlots: {
            customRender: 'manoType'
        },
    },
    {
        title: 'vender',
        dataIndex: 'vendor',
        scopedSlots: {
            customRender: 'vendor'
        },
    },
    {
        title: 'version',
        dataIndex: 'version',
        scopedSlots: {
            customRender: 'version'
        },
    },
    {
        title: 'Action',
        dataIndex: 'action',
        scopedSlots: {
            customRender: 'action'
        },
        width: 180
    }
];
const testJobColumns = [
    {
        title: 'ID',
        dataIndex: 'jobId',
        fixed: 'left',
        width: 50
    },
    {
        title: 'Job Name',
        dataIndex: 'jobName'
    },
    {
        title: 'SUT Name',
        dataIndex: 'sut.name',
    },
    {
        title: 'Job Description',
        dataIndex: 'remark'
    },
    {
        title: 'Test Speciflcation',
        dataIndex: 'spec.name'
    },
    {
        title: 'Created Time',
        dataIndex: 'createTime'
    },
    {
        title: 'Status',
        dataIndex: 'jobStatus',
        width: 70,
        scopedSlots: {
            customRender: 'status'
        },
    },
    {
        title: 'Action',
        dataIndex: 'action',
        fixed: 'right',
        width: 380,
        scopedSlots: {
            customRender: 'action'
        },
    }
]
const testJobDetailCaseListColumns = [
    {
        title: 'Id',
        dataIndex: 'id'
    },
    {
        title: 'Case Id',
        dataIndex: 'caseId',
    },
    {
        title: 'Consumes（ms）',
        dataIndex: 'consumes',
    },
    {
        title: 'Execution Start Time',
        dataIndex: 'executionStartTime'
    },
    {
        title: 'Job Execution Start Time',
        dataIndex: 'jobExecutionStartTime'
    },
    {
        title: 'Case Status',
        dataIndex: 'caseStatus',
        scopedSlots: {
            customRender: 'caseStatus'
        },
        width: 120
    }
]
const testJobDetailCaseChildColumns = [
    {
        title: 'TestCase Name',
        dataIndex: 'testCaseName',
    },
    {
        title: 'TestSuite Name',
        dataIndex: 'testSuiteName'
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime'
    },
    {
        title: 'End Time',
        dataIndex: 'endTime'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        scopedSlots: {
            customRender: 'status'
        },
        width: 120
    }
]
const TestInsrigisterColumns = [
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
        title: 'Mnt Address',
        dataIndex: 'mntAddress'
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
const TestSpecColumns = [
    {
        title: 'ID',
        dataIndex: 'id'
    },
    {
        title: 'Name',
        dataIndex: 'name'
    },
    {
        title: 'Version',
        dataIndex: 'version'
    },
    {
        title: 'SUT Type',
        dataIndex: 'sutTypeCH.dictLabel'
    },
    {
        title: 'Publish ORG',
        dataIndex: 'publishOrg'
    },
    {
        title: 'Publish Time',
        dataIndex: 'publishTime'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        width: 220,
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
    {
        title: 'Status',
        dataIndex: 'status',
        scopedSlots: {
            customRender: 'status'
        },
    },
    {
        title: 'Action',
        dataIndex: 'action',
        width: 180,
        scopedSlots: { customRender: 'action' }
    }
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
const MANOForm = [
    {
        title: 'Name',
        key: 'name'
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
        title: 'MANO Type',
        key: 'manoType',
    }
]
const MANOONAPForm = [
    {
        key: 'aai:host-url:',
        value: 'aaiHostUrl'
    },
    {
        key: 'sdc.catalog:host-url:',
        value: 'sdcCatalogHostUrl',
    },
    {
        key: 'multicloud:host-url:',
        value: 'multicloudHostUrl',
    },
    {
        key: 'sdc.oboarding:host-url:',
        value: 'sdcOboardingHostUrl',
    },
    {
        key: 'vfc:host-url:',
        value: 'vfcHostUrl',
    }
]
const customProfiles = [
    {
        title: 'key',
        dataIndex: 'key',
        scopedSlots: { customRender: 'key' },
        width: '37%'
    },
    {
        title: 'value',
        dataIndex: 'value',
        scopedSlots: { customRender: 'value' },
        width: '53%'
    },
    {
        title: 'action',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
        width: '5%'
    }
]
export {
    mockcolumns,
    axiosgetType,
    PackageMGTTabs,
    TestSUTTabs,
    TestSUTColumns,
    testEnvVIMColumns,
    testEvnVNFMColumns,
    testMANOColumns,
    TestInsrigisterColumns,
    VnfpnfSuiteColumns,
    TestSpecColumns,
    testJobColumns,
    TestCaseColumns,
    VIMForm,
    VNFMForm,
    MANOForm,
    MANOONAPForm,
    customProfiles,
    testJobDetailCaseListColumns,
    testJobDetailCaseChildColumns
}