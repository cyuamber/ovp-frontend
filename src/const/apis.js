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
    sutMgt:{
        sutMgtTable:baseUrl+"/sutMgt",
        sutMgtInsert:baseUrl+"/sutMgt/insert",
        sutMgtUpdate:baseUrl+"/sutMgt/update",
        sutMgtDelete:baseUrl+"/sutMgt/:id/delete",
        sutMgtType:baseUrl+"/types/:flag",
        uploadFile:baseUrl+"/files/upload"
    },
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
    testJboMgt:{
        testJboTable:"/jobs"
    }
}
