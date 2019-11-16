const baseUrl = "/portal/business";
export default {
    //mock api
    mock: {
        address: '/address',
        customerinfo: '/customer/info',
        xurantest: '/xuran/test/json',
        alarmformdata: '/alarm/formdata/v1/multiple',
        home: '/home',
        deleteaddress: '/delete/address',
        putname: '/articles',
    },
    getCurrentLanguage: "/lang/local",
    uploadFile: baseUrl + "/files/upload",
    vimVnfmMgt: {
        vimEnvMgtTable: baseUrl + "/vimEnvMgt",
        cloudRegionID: baseUrl + "/cloudRegionID",
        cloudType: baseUrl + "/cloudType",
        vimEnvMgtInsert: baseUrl + "/vimEnvMgt/insert",
        vimEnvMgtUpdate: baseUrl + "/vimEnvMgt/update",
        vimEnvMgtDelete: baseUrl + "/vimEnvMgt/:id/delete",
        vnfmEnvMgtTable: baseUrl + "/vnfmEnvMgt",
        vnfmEnvMgtInsert: baseUrl + "/vnfmEnvMgt/insert",
        vnfmEnvMgtUpdate: baseUrl + "/vnfmEnvMgt/update",
        vnfmEnvMgtDelete: baseUrl + "/vnfmEnvMgt/:id/delete",
    },
    instrumentMgs: {
        instrumentMgsTable: baseUrl + "/instrumentMgs",
        instrumentMgsInsert: baseUrl + "/instrumentMgs/insert",
        instrumentMgsUpdate: baseUrl + "/instrumentMgs/update",
        instrumentMgsDelete: baseUrl + "/instrumentMgs/:name/delete",
    },
    suiteMgt: {
        suiteMgtTable: baseUrl + "/suiteMgt",
        suiteMgtInsert: baseUrl + "/suiteMgt/insert",
        suiteMgtUpdate: baseUrl + "/suiteMgt/update",
        suiteMgtDelete: baseUrl + "/suiteMgt/:id/delete",
        suiteType: baseUrl + "/types/:flag",
    },
    sutMgt: {
        sutMgtTable: baseUrl + "/sutMgt",
        sutMgtInsert: baseUrl + "/sutMgt/insert",
        sutMgtUpdate: baseUrl + "/sutMgt/update",
        sutMgtDelete: baseUrl + "/sutMgt/:id/delete",
        sutMgtType: baseUrl + "/types/:flag"
    },
    testJobMgt: {
        testJobTable: baseUrl + "/jobs",
        testJobInsert: baseUrl + "/jobs/insert",
        testJobUpdate: baseUrl + "/jobs/:jobId/update",
        testJobDelete: baseUrl + "/jobs/:jobId/delete",
        testJobStart: baseUrl + "/jobs/:jobId/start",
        testJobStop: baseUrl + "/jobs/:jobId/stop",
        testJobProgress: baseUrl + "/jobs/:jobId",
        testJobDetail: baseUrl + "/jobs/cases/:jobId/:ExecutionStartTime",
        testJobSUTType: baseUrl + "/sutType",
        testJobSUTName: baseUrl + "/sutName/:code",
        testJobSpec: baseUrl + "/testSpec/:type",
        testJobTestCase: baseUrl + "/testCase/:id",
    },
    TestSpecMgt: {
        specMgtTable: baseUrl + "/specMgt",
        specMgtInsert: baseUrl + "/specMgt/insert",
        specMgtUpdate: baseUrl + "/specMgt/update",
        specMgtDelete: baseUrl + "/specMgt/:id/delete",
        TestSpecSUTType: baseUrl + "/sutType",
        TestSpecVNFType: baseUrl + "/types/:flag"
    }
}
