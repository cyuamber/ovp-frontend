module.exports =
    {
        "/articles/:user": "/articles?user=:user",
        "/:resource/:id/show": "/:resource/:id",
        "/lang/local": "/getCurrentLanguage",
        "/lang/local?language=:language": "/getCurrentLanguage",
        ///////<-------------VimEnv--------->/////
        "/portal/business/vimEnvMgt":"/_getVIM",
        "/portal/business/cloudType":"/getcloudType",
        "/portal/business/vimEnvMgt/insert":"/loginVIM",
        "/portal/business/vimEnvMgt/update":"/updateVIM",
        "/portal/business/vimEnvMgt/:id/delete":"/deleteVIM",
        "/portal/business/vnfmEnvMgt":"/_getVNFM",
        "/portal/business/vnfmEnvMgt/insert":"/loginVNFM",
        "/portal/business/vnfmEnvMgt/update":"/updateVNFM",
        "/portal/business/vnfmEnvMgt/:id/delete":"/deleteVNFM",
        ///////<-------------Instrument MGS MGT--------->/////
        "/portal/business/instrumentMgs":"/_getMeterSys",
        "/portal/business/instrumentMgs/insert":"/loginMeterSys",
        "/portal/business/instrumentMgs/update":"/updateMeterSys",
        "/portal/business/instrumentMgs/:name/delete":"/deleteMeterSys",
        ///////<-------------Instrument Package MGT--------->/////
        "/portal/business/suiteMgt":"/_getTestMeter",
        "/portal/business/suiteMgt/insert":"/loginMeterSys",
        "/portal/business/suiteMgt/update":"/updateMeterSys",
        "/portal/business/suiteMgt/:name/delete":"/deleteMeterSys",
        ///////<-------------TestSUT--------->/////
        "/portal/business/sutMgt":"/_getVNFTest",
        "/portal/business/sutMgt/insert":"/createVNFTest",
        "/portal/business/sutMgt/update":"/updateVNFTest",
        "/portal/business/sutMgt/:id/delete":"/deleteVNFTest",
        "/portal/business/types/:flag":"/getVNFType",
        "/portal/business/files/upload":"/updateVNFTest",
        ///////<-------------Test Spec MGT--------->/////
        "/portal/business/specMgt":"/_getTestSpec",
        "/portal/business/specMgt/insert":"/addTestSpec",
        "/portal/business/specMgt/update":"/updateTestSpec",
        "/portal/business/specMgt/:id/delete":"/deleteTestSpec",
        "/portal/business/sutType":"/_getTestSpecSUTType",
        ///////<-------------Test Job--------->/////
        "/portal/business/jobs":"/_getTestJobMGT",
        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1_$2_$3_$4",
        "/*/*/*/*/*": "/$1_$2_$3_$4_$5",
    }