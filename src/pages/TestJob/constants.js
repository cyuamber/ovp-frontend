// status list
//测试未开始、测试运行中、测试通过、测试失败

export const formList = [
    "Job Name",
    "Job Description",
    "SUT Type",
    "SUT Name",
    "Test Specification",
    "Test VNFM ENV",
    "Test VIM ENV",
    "Test MANO ENV",
    "Test Instrument",
];
export const statusOptions = [
    "All",
    "CREATED",
    "UPDATED",
    "RUNNING",
    "DONE",
    "FAILED",
];
export const jobOptions = {
    Start: "blue",
    Stop: "pink",
    Edit: "green",
    Delete: "red",
    Download: "#D3B230",
    More: "purple",
};

export const testJobColumns = [
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
export const testJobDetailCaseListColumns = [
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
export const testJobDetailCaseChildColumns = [
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
export const testJobDetailInstrumentColumns = [
    // 2020.12.01 新增的子表格配置项
    {
        title: "Instrument",
        dataIndex: "instrument",
        source: "key"
    },
    {
        title: "Call Rate",
        dataIndex: "call_rate",
    },
    {
        title: "Elapsed Time",
        dataIndex: "elapsed_time",
    },
    {
        title: "Outgoing Calls",
        dataIndex: "outgoing_calls",
    },
    {
        title: "Incoming Calls",
        dataIndex: "incoming_calls",
    },
    {
        title: "Failed Calls",
        dataIndex: "failed_calls",
        width: 150,
    },
];
