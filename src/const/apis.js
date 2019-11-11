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
    sutMgt:{
        sutMgtTable:baseUrl+"/sutMgt",
        sutMgtInsert:baseUrl+"/sutMgt/insert",
        sutMgtUpdate:baseUrl+"/sutMgt/:id/update",
        sutMgtDelete:baseUrl+"/sutMgt/:id/delete",
        sutMgtType:baseUrl+"/sutMgt/:flag",
        uploadFile:baseUrl+"/files/upload"
    }
}
