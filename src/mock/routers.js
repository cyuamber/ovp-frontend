module.exports =
    {
        "/articles/:user": "/articles?user=:user",
        "/:resource/:id/show": "/:resource/:id",
        "/lang/local": "/getCurrentLanguage",
        "/lang/local?language=:language": "/getCurrentLanguage",
        ///////<-------------TestSUT--------->/////
        "/portal/:business/sutMgt":"/getVNFTest",
        "/portal/business/sutMgt/insert":"/createVNFTest",
        "/portal/business/sutMgt/:update":"/updateVNFTest",
        "/portal/business/sutMgt/:id/delete":"/deleteVNFTest",
        "/portal/business/types/:flag":"/getVNFType",
        "/portal/business/files/upload":"/uploadVNFFile",
        ///////<-------------VimEnv--------->/////
        "/portal/business/:vimEnvMgt":"/getVIM",
        "/portal/business/:cloudRegionID":"/cloudRegionID",
        "/portal/business/cloudType":"/getcloudType",
        "/portal/business/vimEnvMgt/insert":"/loginVIM",
        "/portal/business/vimEnvMgt/:update":"/updateVIM",
        "/portal/business/vimEnvMgt/:id/delete":"/deleteVIM",

        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1_$2_$3_$4",
        "/*/*/*/*/*": "/$1_$2_$3_$4_$5",
    }