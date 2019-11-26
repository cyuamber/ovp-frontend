module.exports =
    {
        "/articles/:user": "/articles?user=:user",
        "/:resource/:id/show": "/:resource/:id",
        "/lang/local": "/getCurrentLanguage",
        "/lang/local?language=:language": "/getCurrentLanguage",
        ///////<-------------Dashboard--------->/////
        "/portal/business/dashboard/statisticLiveCaseAmount":"/_getLiveCaseAmount",
        "/portal/business/dashboard/statisticPassCaseAmount7Days":"/_getPassCaseAmount7Days",
        "/portal/business/dashboard/statisticJobsFlowAmount":"/_getJobsFlowAmount",
        "/portal/business/dashboard/sutAmount":"/_getSutAmount",
        "/portal/business/dashboard/statisticJobsAmount":"/_getJobAmount",
        "/portal/business/dashboard/testEnvAmount":"/_getTestEnvAmount",
        ///////<-------------VimEnv--------->/////
        "/portal/business/vimEnvMgt":"/_getVIM",
        "/portal/business/cloudType/1000":"/getcloudType",
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
        "/portal/business/files/:filename":"/_downloadFile",
        ///////<-------------TestSUT--------->/////
        "/portal/business/sutMgt":"/_getVNFTest",
        "/portal/business/sutMgt/insert":"/createVNFTest",
        "/portal/business/sutMgt/update":"/updateVNFTest",
        "/portal/business/sutMgt/:id/delete":"/deleteVNFTest",
        "/portal/business/types/:flag":"/getVNFType",
        "/portal/business/files/upload":"/updateVNFTest",
        ///////<-------------Test Spec MGT--------->/////
        "/portal/business/specMgt":"/_getTestSpec",
        "/portal/business/testCase/:specId":"/_getTestCaseTable",
        "/portal/business/specMgt/insert":"/addTestSpec",
        "/portal/business/specMgt/update":"/updateTestSpec",
        "/portal/business/specMgt/:id/delete":"/deleteTestSpec",
        "/portal/business/testCase/updateStatus/:id/:status":"/updateTestSpec",
        "/portal/business/sutType/100":"/_getTestSpecSUTType",
        "/portal/business/testCase/box/:flag/:subSutType":"/_getTestCaseList",
        ///////<-------------Test Job--------->/////
        "/portal/business/jobs":"/_getTestJobMGT",
        "/portal/business/sutName/:code":"/getSUTName",
        "/portal/business/testSpec/:type":"/getJobSpecification",
        "/portal/business/testCase/jobCase/:id":"/getTestCaseList",
        "/portal/business/jobs/insert":"/addTestSpec",
        "/portal/business/jobs/:jobId/update":"/addTestSpec",
        "/portal/business/jobs/:jobId/start":"/runTestJobMGT",
        "/portal/business/jobs/:jobId/stop":"/stopTestJobMGT",
        "/portal/business/jobs/:jobId":"/_getJobProgress",
        "/portal/business/jobs/cases/:jobId/:ExecutionStartTime":"/_testJobDetail",
        "/portal/business/jobs/cases/download/:jobId":"/_downloadFile",
        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1_$2_$3_$4",
        "/*/*/*/*/*": "/$1_$2_$3_$4_$5",
    }