module.exports =
    {
        "/articles/:user": "/articles?user=:user",
        "/:resource/:id/show": "/:resource/:id",
        ///////<-------------TestSUT--------->/////
        "/portal/business/sutMgt?flag=:flag":"/getVNFTest",
        "/portal/business/sutMgt/insert":"/createVNFTest",
        "/portal/business/sutMgt/:id/update":"/updateVNFTest",
        "/portal/business/sutMgt/:id/delete":"/deleteVNFTest",
        "/portal/business/sutMgt/:flag":"/getVNFType",
        "/portal/business/files/upload":"/uploadVNFFile",

        "/api/*": "/$1",
        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1_$2_$3_$4",
        "/*/*/*/*/*": "/$1_$2_$3_$4_$5",
    }