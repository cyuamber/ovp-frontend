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

export { axiosgetType, mockcolumns };
