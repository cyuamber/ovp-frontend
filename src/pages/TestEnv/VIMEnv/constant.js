const customProfiles = [
    {
        title: "key",
        dataIndex: "key",
        scopedSlots: { customRender: "key" },
        width: "37%",
    },
    {
        title: "value",
        dataIndex: "value",
        scopedSlots: { customRender: "value" },
        width: "53%",
    },
    {
        title: "action",
        dataIndex: "action",
        scopedSlots: { customRender: "action" },
        width: "5%",
    },
];
const VIMForm = [
    {
        title: "Cloud Owner",
        key: "cloudOwner",
    },
    {
        title: "Cloud Region ID",
        key: "cloudRegionId",
    },
    {
        title: "Cloud Type",
        key: "cloudType",
    },
    {
        title: "Cloud Region Version",
        key: "cloudVersion",
    },
    {
        title: "User Name",
        key: "username",
    },
    {
        title: "Password",
        key: "password",
    },
    {
        title: "Auth URL",
        key: "authUrl",
    },
    {
        title: "ssl Cacert",
        key: "sslCacert",
    },
    {
        title: "ssl Insecure",
        key: "sslInsecure",
    },
    {
        title: "Cloud Domain",
        key: "cloudDomain",
    },
    {
        title: "Default Tenant",
        key: "defaultTenant",
    },
];
const VNFMForm = [
    {
        title: "Name",
        key: "name",
    },
    {
        title: "Type",
        key: "type",
    },
    {
        title: "Vendor",
        key: "vendor",
    },
    {
        title: "Version",
        key: "version",
    },
    {
        title: "URL",
        key: "url",
    },
    {
        title: "VIM",
        key: "vim",
    },
    {
        title: "Certificate URL",
        key: "certificateUrl",
    },
    {
        title: "User Name",
        key: "username",
    },
    {
        title: "Password",
        key: "password",
    },
];
const MANOForm = [
    {
        title: "Name",
        key: "name",
    },
    {
        title: "Vendor",
        key: "vendor",
    },
    {
        title: "Version",
        key: "version",
    },
    {
        title: "MANO Type",
        key: "manoType",
    },
];
const MANOONAPForm = [
    {
        key: "aai:host-url:",
        value: "aaiHostUrl",
    },
    {
        key: "sdc.catalog:host-url:",
        value: "sdcCatalogHostUrl",
    },
    {
        key: "multicloud:host-url:",
        value: "multicloudHostUrl",
    },
    {
        key: "sdc.oboarding:host-url:",
        value: "sdcOboardingHostUrl",
    },
    {
        key: "vfc:host-url:",
        value: "vfcHostUrl",
    },
];

const testEnvVIMColumns = [
    {
        title: "ID",
        dataIndex: "id",
        fixed: "left",
        width: 50,
    },
    {
        title: "Status",
        dataIndex: "status",
        scopedSlots: {
            customRender: "status",
        },
    },
    {
        title: "Cloud Owner",
        dataIndex: "cloudOwner",
    },
    {
        title: "Cloud Region ID",
        dataIndex: "cloudRegionId",
    },
    {
        title: "Cloud Type",
        dataIndex: "cloudTypeCH.dictLabel",
    },
    {
        title: "Cloud Version",
        dataIndex: "cloudVersion",
    },
    {
        title: "User Name",
        dataIndex: "username",
    },
    {
        title: "Default Tenant",
        dataIndex: "defaultTenant",
    },
    {
        title: "Create Time",
        dataIndex: "createTime",
    },
    {
        title: "Auth URL",
        dataIndex: "authUrl",
    },
    // {
    //     title: 'Tenant',
    //     dataIndex: 'tenant'
    // },
    {
        title: "Action",
        dataIndex: "action",
        scopedSlots: {
            customRender: "action",
        },
        fixed: "right",
        width: 180,
    },
];
const testEvnVNFMColumns = [
    {
        title: "ID",
        dataIndex: "id",
        fixed: "left",
        width: 50,
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Type",
        dataIndex: "type",
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
        title: "URL",
        dataIndex: "url",
    },
    {
        title: "VIM",
        dataIndex: "vim",
    },
    {
        title: "Create Time",
        dataIndex: "createTime",
    },
    {
        title: "User Name",
        dataIndex: "username",
    },
    {
        title: "Action",
        dataIndex: "action",
        scopedSlots: {
            customRender: "action",
        },
        width: 180,
        fixed: "right",
    },
];
const testMANOColumns = [
    {
        title: "ID",
        dataIndex: "id",
        width: 180,
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Type",
        dataIndex: "manoType",
        scopedSlots: {
            customRender: "manoType",
        },
    },
    {
        title: "vender",
        dataIndex: "vendor",
        scopedSlots: {
            customRender: "vendor",
        },
    },
    {
        title: "version",
        dataIndex: "version",
        scopedSlots: {
            customRender: "version",
        },
    },
    {
        title: "Action",
        dataIndex: "action",
        scopedSlots: {
            customRender: "action",
        },
        width: 180,
    },
];

export {
    testEnvVIMColumns,
    testEvnVNFMColumns,
    testMANOColumns,
    VIMForm,
    VNFMForm,
    MANOForm,
    MANOONAPForm,
    customProfiles,
};
