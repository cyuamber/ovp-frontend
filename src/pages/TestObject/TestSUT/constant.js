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

export { TestSUTTabs, TestSUTColumns };
