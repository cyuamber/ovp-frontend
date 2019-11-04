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
const TestSUTColumns = [{
        title: 'ID',
        dataIndex: 'index'
    },
    {
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
        dataIndex: 'index',
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
        title: 'CloudOwner',
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
        dataIndex: 'userName'
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
const testEvnVNFMColumns = [
    {
        title: 'NO.',
        dataIndex: 'index',
        fixed: 'left',
        width: 50,
    },
    {
        title: 'Name',
        dataIndex: 'VNFMname',
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
	width:180,
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
	width:180,
        scopedSlots: {customRender: 'action'}
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
        title: 'VNF Type',
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
        width:180,
        scopedSlots: { customRender: 'action' }
    }
]
const TestCaseColumns = [
    {
        title: 'Number',
        dataIndex: 'testCaseNm'
    },
    {
        title: 'Name',
        dataIndex: 'testCaseName'
    },
    {
        title: 'Description',
        dataIndex: 'testCaseDes'
    },
    {
        title: 'Version',
        dataIndex: 'testCaseVersion'
    },
    {
        title: 'Status',
        dataIndex: 'testCaseState',
        width: 120,
        scopedSlots: {
            customRender: 'testCaseState'
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
        key: 'userName'
    },
    {
        title: 'Password',
        key: 'passwd'
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
        key: 'VNFMname'
    },
    {
        title: 'Type',
        key: 'VNFMtype'
    },
    {
        title: 'Vendor',
        key: 'VNFMvendor',
    },
    {
        title: 'Version',
        key: 'VNFMversion',
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
        key: 'authUrl',
    },
    {
        title: 'User Name',
        key: 'username',
    },
    {
        title:  'Password',
        key: 'password'
    }
]

export {
    mockcolumns,
    TestSUTColumns,
    testEnvVIMColumns,
    testEvnVNFMColumns,
    TestInsrigisterColumns,
    VnfpnfSuiteColumns,
    TestSpecColumns,
    testJobColumns,
    TestCaseColumns,
    VIMForm,
    VNFMForm
}