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
    getCurrentLanguage:"/lang/local",
    vimVnfmMgt:{
        vimEnvMgtTable:baseUrl+"/vimEnvMgt",
        cloudRegionID:baseUrl+"/cloudRegionID",
        cloudType:baseUrl+"/cloudType",
        vimEnvMgtInsert:baseUrl+"/vimEnvMgt/insert",
        vimEnvMgtUpdate:baseUrl+"/vimEnvMgt/update",
        vimEnvMgtDelete:baseUrl+"/vimEnvMgt/:id/delete",
        vnfmEnvMgtTable:baseUrl+"/vnfmEnvMgt",
        vnfmEnvMgtInsert:baseUrl+"/vnfmEnvMgt/insert",
        vnfmEnvMgtUpdate:baseUrl+"/vnfmEnvMgt/update",
        vnfmEnvMgtDelete:baseUrl+"/vnfmEnvMgt/:id/delete",
    },
    instrumentMgs:{
        instrumentMgsTable:baseUrl+"/instrumentMgs",
        instrumentMgsInsert:baseUrl+"/instrumentMgs/insert",
        instrumentMgsUpdate:baseUrl+"/instrumentMgs/update",
        instrumentMgsDelete:baseUrl+"/instrumentMgs/:id/`delete",
    },
    suiteMgt:{
        suiteMgt:baseUrl+"/suiteMgt",
        suiteMgtInsert:baseUrl+"/suiteMgt/insert",
        suiteMgtUpdate:baseUrl+"/suiteMgt/update",
        suiteMgtDelete:baseUrl+"/suiteMgt/:id/delete",
        suiteType:baseUrl+"/types/:flag",
    },
    sutMgt:{
        sutMgtTable:baseUrl+"/sutMgt",
        sutMgtInsert:baseUrl+"/sutMgt/insert",
        sutMgtUpdate:baseUrl+"/sutMgt/update",
        sutMgtDelete:baseUrl+"/sutMgt/:id/delete",
        sutMgtType:baseUrl+"/types/:flag",
        uploadFile:baseUrl+"/files/upload"
    },
    testJboMgt:{
        testJboTable:baseUrl+"/jobs",
        testJboStart:baseUrl+"/jobs/:jobId/start",
        testJboStop:baseUrl+"/jobs/:jobId/stop"
    },
    TestSpecMgt:{
        specMgtTable:baseUrl+"/specMgt",
        specMgtInsert:baseUrl+"/specMgt/insert",
        specMgtUpdate:baseUrl+"/specMgt/update",
        specMgtDelete:baseUrl+"/specMgt/:id/delete",
    }
}
