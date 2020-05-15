export const TestSpecColumns = [
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
export const TestCaseColumns = [
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
