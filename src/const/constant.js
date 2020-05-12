const env = process.env.NODE_ENV;
let axiosgetType;

switch (env) {
    case "development":
        axiosgetType = env === "development" ? false : true;
        break;
    case "production":
        axiosgetType = env !== "development" ? false : true;
        break;
    default:
        break;
}

//  axiosgetType = env !== 'development' ? false : true

const mockcolumns = [
    {
        title: "Avatar",
        key: "avatar",
        scopedSlots: {
            customRender: "avatar",
        },
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Address",
        dataIndex: "address",
    },
    {
        title: "Phone",
        dataIndex: "phone",
    },
];
const PackageMGTTabs = [
    {
        key: "VNF",
        val: 101,
    },
    {
        key: "PNF",
        val: 102,
    },
];
const TestSUTTabs = [
    {
        key: "VNF",
        val: 101,
    },
    {
        key: "PNF",
        val: 102,
    },
    {
        key: "NFVI",
        val: 103,
    },
];
const TestSUTColumns = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Type",
        dataIndex: "typeCH.dictLabel",
    },
    {
        title: "Vendor",
        dataIndex: "vendor",
    },
    {
        title: "Create Time",
        dataIndex: "createTime",
    },
    {
        title: "Action",
        dataIndex: "action",
        scopedSlots: {
            customRender: "action",
        },
        width: 250,
    },
];

const testJobColumns = [
    {
        title: "ID",
        dataIndex: "jobId",
        fixed: "left",
        width: 180,
    },
    {
        title: "Job Name",
        dataIndex: "jobName",
    },
    {
        title: "SUT Name",
        dataIndex: "sut.name",
    },
    {
        title: "Job Description",
        dataIndex: "remark",
    },
    {
        title: "Test Speciflcation",
        dataIndex: "spec.name",
    },
    {
        title: "Created Time",
        dataIndex: "createTime",
    },
    {
        title: "Status",
        dataIndex: "jobStatus",
        width: 80,
        scopedSlots: {
            customRender: "status",
        },
    },
    {
        title: "Action",
        dataIndex: "action",
        fixed: "right",
        width: 380,
        scopedSlots: {
            customRender: "action",
        },
    },
];
const testJobDetailCaseListColumns = [
    {
        title: "Id",
        dataIndex: "id",
    },
    {
        title: "Case Name",
        dataIndex: "caseName",
    },
    {
        title: "Case Id",
        dataIndex: "caseId",
    },
    {
        title: "Consumes（ms）",
        dataIndex: "consumes",
    },
    {
        title: "Execution Start Time",
        dataIndex: "executionStartTime",
    },
    {
        title: "Job Execution Start Time",
        dataIndex: "jobExecutionStartTime",
    },
    {
        title: "Case Status",
        dataIndex: "caseStatus",
        scopedSlots: {
            customRender: "caseStatus",
        },
        width: 120,
    },
];
const testJobDetailCaseChildColumns = [
    {
        title: "TestCase Name",
        dataIndex: "testCaseName",
    },
    {
        title: "TestSuite Name",
        dataIndex: "testSuiteName",
    },
    {
        title: "Start Time",
        dataIndex: "startTime",
    },
    {
        title: "End Time",
        dataIndex: "endTime",
    },
    {
        title: "Status",
        dataIndex: "status",
        scopedSlots: {
            customRender: "status",
        },
        width: 120,
    },
];
const TestInsrigisterColumns = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Vendor",
        dataIndex: "vendor",
    },
    {
        title: "Mnt Address",
        dataIndex: "mntAddress",
    },
    {
        title: "Create Time",
        dataIndex: "createTime",
    },
    {
        title: "Action",
        dataIndex: "action",
        width: 180,
        scopedSlots: { customRender: "action" },
    },
];
const VnfpnfSuiteColumns = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Vendor",
        dataIndex: "vendor",
    },
    {
        title: "Version",
        dataIndex: "version",
    },
    {
        title: "Type",
        dataIndex: "typeCH.dictLabel",
    },
    {
        title: "Create Time",
        dataIndex: "createTime",
    },
    {
        title: "Action",
        dataIndex: "action",
        width: 300,
        scopedSlots: { customRender: "action" },
    },
];
const TestSpecColumns = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Version",
        dataIndex: "version",
    },
    {
        title: "SUT Type",
        dataIndex: "sutTypeCH.dictLabel",
    },
    {
        title: "Publish ORG",
        dataIndex: "publishOrg",
    },
    {
        title: "Publish Time",
        dataIndex: "publishTime",
    },
    {
        title: "Action",
        dataIndex: "action",
        width: 220,
        scopedSlots: { customRender: "action" },
    },
];
const TestCaseColumns = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
        title: "Status",
        dataIndex: "status",
        scopedSlots: {
            customRender: "status",
        },
    },
    {
        title: "Action",
        dataIndex: "action",
        width: 180,
        scopedSlots: { customRender: "action" },
    },
];

export {
    mockcolumns,
    axiosgetType,
    PackageMGTTabs,
    TestSUTTabs,
    TestSUTColumns,
    TestInsrigisterColumns,
    VnfpnfSuiteColumns,
    TestSpecColumns,
    testJobColumns,
    TestCaseColumns,
    testJobDetailCaseListColumns,
    testJobDetailCaseChildColumns,
};
